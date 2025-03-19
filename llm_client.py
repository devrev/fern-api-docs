import os
import re
import requests

def get_response(prompt):

    auth = os.environ.get('LLM_JWT')
    if auth:
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
            response = r.json()['choices'][0]['message']['content']
            response = re.sub(r"^# .*\n?", '', response, flags=re.MULTILINE)
            response = re.sub(r"^Here.*\n?", '', response, flags=re.MULTILINE)
            response = re.sub(r"^Let me know.*\n?", '', response, flags=re.MULTILINE)
            return response
        except Exception as e:
            print(f"Failed to generate changelog. Error: {type(e)} {e} {r}")
            return None
        