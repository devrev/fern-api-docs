import yaml
import argparse
import requests
import os
import datetime
import re


def main(vrn, d):

    print(f"Generating prompt for `{vrn}` API on {d}.")

    p = gen_prompt(f"temp/{vrn}/{d}_oasdiff.md", get_links(vrn), vrn)

    pr_file = f"temp/{vrn}/{d}_prompt.md"
    with open(pr_file, 'w', encoding="utf-8") as outfile:
        outfile.write(p)
        print(f"Wrote prompt to {pr_file}.")

    l = gen_log(p)

    log_file = f"./fern/apis/{vrn}/changelog/{d}.md"
    with open(log_file, 'w', encoding="utf-8") as outfile:
        outfile.write(l)
        print(f"Wrote log to {log_file}.")


def gen_log(prompt):

    log = None
    auth = os.environ.get('LLM_JWT')
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {auth}"}
    payload = {
        "model": "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    try:
        r = requests.post('https://openwebui.dev.devrev-eng.ai/api/chat/completions', json=payload,
                            headers=headers)
        log = r.json()['choices'][0]['message']['content']
        log = re.sub(r"^Here's.*\n?", '', log, flags=re.MULTILINE)
        log = re.sub(r"^Let me know.*\n?", '', log, flags=re.MULTILINE)
    except Exception as e:
        print(
            f"Failed to generate changelog. Error: {type(e)} {e} {r}")
    return log


def gen_prompt(oasdiff, links, version):
    with open(oasdiff, 'r') as infile:
        oasdiff = infile.read()

    prompt = f"""
Please provide an API changelog for the {version} API from the following OASDiff of OpenAPI spec changes. The output should be in markdown format grouping endpoints by use case/object type. For cases where some schema is modified, please also tell what endpoints it affects. Wherever an endpoint, property, or enum value is mentioned, surround it with backticks (`). Wherever an API is mentioned, include a link to the {version} API reference from the list of {version} API links in markdown.

<oasdiff>
{oasdiff}
</oasdiff>

<api_links>
{links}
</api_links>
"""

    return prompt

def get_links(version):

    src = f"./fern/apis/{version}/openapi-{version}.yaml"

    with open(src, 'r') as s:
        spec = yaml.safe_load(s)
    apis = {}
    for endp, defn in spec['paths'].items():
        for val in defn.values():
            tag = val.get('tags')[0]
            opId = val.get('operationId')
            api = {'opId' : opId, 'method': endp.split('.')[-1]}
            api['target'] = f"/{version}/api-reference/{tag}/{opId.replace(f'{tag}-', '')}"
            if tag not in apis:
                apis[tag] = {endp: api}
            else:
                apis[tag][endp] = api

    md = f"# {version}\n\n"
    for tag, api in sorted(apis.items()):
        md += f"\n## {tag}\n\n"
        for endp, val in api.items():
            link_text = f"**{tag} > {val['method']}**: `{val['opId']}`"
            md += f"- [{endp}]({val['target']}) {link_text}\n"
    return md

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate release notes")
    parser.add_argument('--date', default=datetime.date.today())
    parser.add_argument('--beta', default=True,
                        action=argparse.BooleanOptionalAction)
    parser.add_argument('--public', default=True,
                        action=argparse.BooleanOptionalAction)
    args = parser.parse_args()
    if args.beta:
        main('beta', args.date)
    if args.public:
        main('public', args.date)