import yaml
import argparse
import glob
import os
import datetime

def main(vrn, d):

    print(f"Generating prompt for `{vrn}` API on {d}.")

    links = get_links(vrn)

    oasdiff = f"temp/{vrn}/{d}_oasdiff.md"
    with open(oasdiff, 'r') as infile:
        oasdiff = infile.read()

    prompt = f"""
Please provide an API changelog from the following OASDiff of OpenAPI spec changes. The output should be in markdown format grouping endpoints by use case/object type. For cases where some schema is modified, please also tell what endpoints it affects. Wherever an API is mentioned, include a link to the API reference from the list of API links in markdown.

<oasdiff>
{oasdiff}
</oasdiff>

<api_links>
{links}
</api_links>
"""
    pr_file = f"temp/{vrn}/{d}_prompt.md"
    with open(pr_file, 'w', encoding="utf-8") as outfile:
        outfile.write(prompt)
        print(f"Wrote prompt to {pr_file}.")

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
            api['target'] = f"https://developer.devrev.ai/{version}/api-reference/{tag}/{opId.replace(f'{tag}-', '')}"
            if tag not in apis:
                apis[tag] = {endp: api}
            else:
                apis[tag][endp] = api

    md = f"# {version}\n\n"
    for tag, api in apis.items():
        md += f"\n## {tag}\n\n"
        for val in api.values():
            link_text = f"{tag} > {val['method']} `{val['opId']}`"
            md += f"- [{link_text}]({val['target']})\n"
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