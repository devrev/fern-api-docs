import argparse
import os
import pathlib
import llm_client

def main(args):
    print(f"Checking style for {args.doc}")
    doc_name, ext = os.path.splitext(os.path.basename(args.doc))

    with open('style/prompt.md', 'r') as infile:
        prompt = infile.read()
    prompt += "\n\n"

    with open('style/style-common.md', 'r', encoding="utf-8") as infile:
        prompt += infile.read()

    if args.style and os.path.exists(args.style):
        with open(args.style, 'r', encoding="utf-8") as infile:
            prompt += "\n\n"
            prompt += infile.read()
            prompt += "\n\n"

    with open('style/term-common.csv', 'r', encoding="utf-8") as infile:
            prompt += "\n\n<terminology>\n"
            prompt += infile.read()
    
    if args.term and os.path.exists(args.term):
        with open(args.style, 'r', encoding="utf-8") as infile:
            prompt += infile.read()
    prompt += "\n</terminology>\n\n"

    with open(args.doc, 'r', encoding="utf-8") as infile:
        prompt += "\n\n<document>\n\n"
        prompt += infile.read()
        prompt += "\n\n</document>\n\n"
    
    prompt_file = f"temp/{doc_name}_prompt.md"
    with open(prompt_file, 'w', encoding="utf-8") as outfile:
        outfile.write(prompt)
        print(f"Wrote prompt to {prompt_file}.")

    response = llm_client.get_response(prompt)
    response_file = f"temp/{doc_name}_response.md"
    if (response):
        with open(response_file, 'w', encoding="utf-8") as outfile:
            outfile.write(response)
            print(f"Wrote response to {response_file}.")
    else:
        print(f"Failed to generate {response_file}.")

    revision = llm_client.get_lines_between_tags(response, 'document')
    revision_file = f"temp/{doc_name}_revision.md"
    if (revision):
        with open(revision_file, 'w', encoding="utf-8") as outfile:
            outfile.write(revision)
            print(f"Wrote revision to {revision_file}.")
    else:
        print(f"Failed to generate {revision_file}.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Check writing style of markdown file")
    parser.add_argument('--doc', type=pathlib.Path, required=True)
    parser.add_argument('--style', type=pathlib.Path)
    parser.add_argument('--term', type=pathlib.Path)

    args = parser.parse_args()
    main(args)