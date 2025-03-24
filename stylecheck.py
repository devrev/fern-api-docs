import argparse
import os
import pathlib
import llm_client


import difflib

def gen_diff(before, after, filename="file.txt"):

    before_lines = before.splitlines(keepends=True)
    after_lines = after.splitlines(keepends=True)

    diff = difflib.unified_diff(
        before_lines,
        after_lines,
        fromfile=f"a/{filename}",
        tofile=f"b/{filename}",
    )
    return "".join(diff)

def gen_prompt(args):

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

    prompt += "\n\n<document>\n\n"
    prompt += args.doc
    prompt += "\n\n</document>\n\n"

    return prompt

def my_writer(content, file, note=None):
    if (content):
        with open(file, 'w', encoding="utf-8") as outfile:
            outfile.write(content)
            print(' '.join(['Wrote', note, 'to', file]))
            #print(f"Wrote {note} to {file}.")
    else:
        print(f"Failed to write {file}.")

def main(args):
    print(f"Checking style for {args.doc}")
    doc_name, ext = os.path.splitext(os.path.basename(args.doc))

    with open(args.doc, 'r', encoding="utf-8") as infile:
        args.doc = infile.read()

    prompt = gen_prompt(args)
    my_writer(prompt, f"temp/{doc_name}_prompt.md", 'prompt')
    response = llm_client.get_response(prompt)
    my_writer(response, f"temp/{doc_name}_response.md", 'response')
    revision = llm_client.get_lines_between_tags(response, 'document')
    my_writer(revision, f"temp/{doc_name}_revision{ext}", 'revision')
    diff = gen_diff(args.doc, revision, doc_name)
    my_writer(diff, f"temp/{doc_name}.diff", 'diff')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Check writing style of markdown file")
    parser.add_argument('--doc', type=pathlib.Path, required=True)
    parser.add_argument('--style', type=pathlib.Path)
    parser.add_argument('--term', type=pathlib.Path)

    args = parser.parse_args()
    main(args)