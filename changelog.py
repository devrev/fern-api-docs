import yaml
import argparse

def main(vrn):

    src = f"./fern/apis/{vrn}/openapi-{vrn}.yaml"

    with open(src, 'r') as s:
        spec = yaml.safe_load(s)
    apis = {}
    for endp, defn in spec['paths'].items():
        for val in defn.values():
            tag = val.get('tags')[0]
            opId = val.get('operationId')
            api = {'opId' : opId, 'method': endp.split('.')[-1]}
            api['target'] = f"https://developer.devrev.ai/{vrn}/api-reference/{tag}/{opId.replace(f'{tag}-', '')}"
            if tag not in apis:
                apis[tag] = {endp: api}
            else:
                apis[tag][endp] = api

    md = f"# {vrn}\n\n"
    for tag, api in apis.items():
        md += f"\n## {tag}\n\n"
        for val in api.values():
            link_text = f"{tag} > {val['method']} `{val['opId']}`"
            md += f"- [{link_text}]({val['target']})\n"
    links = f"temp/{vrn}.md"
    with open(links, "w", encoding="utf-8") as outfile:
        outfile.write(md)
        print(f"Wrote list to {links}.")
    return

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate release notes")
    parser.add_argument('--beta', default=True,
                        action=argparse.BooleanOptionalAction)
    parser.add_argument('--public', default=False,
                        action=argparse.BooleanOptionalAction)
    args = parser.parse_args()
    version = None
    if args.beta:
        version = 'beta'
    elif args.public:
        version = 'public'
    else:
        print("Specify --beta, --public, or both.")
    if version:
        main(version)
