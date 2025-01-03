import yaml
import argparse

def main(vrn):

    src = f"./fern/apis/{vrn}/openapi-beta.yaml"

    with open(src, 'r') as s:
        spec = yaml.safe_load(s)
        
    for endp, defn in spec['paths'].items():
        for prop, desc in defn.items():
            tag = desc.get('tags')[0]
            opId = desc.get('operationId')
        link = f"- [{tag} > {endp.split('.')[-1]} `{opId}`](https://developer.devrev.ai/{vrn}/api-reference/{tag}/{opId})"
        print(link)

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
