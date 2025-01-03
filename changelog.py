import yaml
import argparse
import urllib.request
import xmltodict


def main(args):

    with urllib.request.urlopen('http://developer.devrev.ai/sitemap.xml') as f:
        xml_data = f.read().decode('utf-8')

    if args.beta:
        version = 'beta'
    elif args.public:
        version = 'public'

    data_dict = xmltodict.parse(xml_data)
    urls = []
    for i in data_dict['urlset']['url']:
        loc = i['loc'].replace('https://developer.devrev.ai', '')
        if '/api-reference' in loc and loc.startswith(f"/{version}"):
            path = loc.split('/')
            link = f"- [{path[-2]} > {path[-1]}]({loc})"
            print(link)


    #get_specs(version) 

def get_specs(version):

    src = f"./fern/apis/{version}/openapi-beta.yaml"

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
