import yaml
import argparse

def main(args):

    if args.beta:
        spec_src = './fern/apis/beta/openapi-beta.yaml'

    get_specs(spec_src) 

def get_specs(src):

    with open(src, 'r') as s:
        spec = yaml.safe_load(s)
    apis = {}
    for endp, defn in spec['paths'].items():
        apis[endp] = {'tags': defn.get('tags')}
        for prop, desc in defn.items():
            apis[endp] = {prop: desc.get('operationId')}
    print(apis)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate release notes")
    parser.add_argument('--beta', default=True,
                        action=argparse.BooleanOptionalAction)
    parser.add_argument('--public', default=False,
                        action=argparse.BooleanOptionalAction)
    args = parser.parse_args()
    if (args.beta or args.public):
        main(args)
    else:
        print("Specify --beta, --public, or both.")
