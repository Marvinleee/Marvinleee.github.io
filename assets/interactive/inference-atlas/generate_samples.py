"""Reproduce the teaching fixtures without model weights.

Install tokenizers==0.20.3 and jinja2==3.1.5 in an isolated environment.
Download tokenizer.json, tokenizer_config.json, config.json from:
https://huggingface.co/Qwen/Qwen3-8B/tree/b968826d9c46dd6066d109eabc6255188de91218
Run: python generate_samples.py /path/to/tokenizer.json /path/to/tokenizer_config.json /path/to/config.json
JSON is written to stdout. The template path covers single user messages only.
"""
import hashlib
import json
import sys
from pathlib import Path
import tokenizers
import jinja2
from jinja2.sandbox import ImmutableSandboxedEnvironment

REVISION = 'b968826d9c46dd6066d109eabc6255188de91218'

def main():
    files = [Path(p) for p in sys.argv[1:]]
    if len(files) != 3:
        raise SystemExit('Expected tokenizer.json tokenizer_config.json config.json')
    tokenizer = tokenizers.Tokenizer.from_file(str(files[0]))
    tc = json.loads(files[1].read_text())
    config = json.loads(files[2].read_text())
    template = ImmutableSandboxedEnvironment().from_string(tc['chat_template'])
    def encode(text):
        result = tokenizer.encode(text, add_special_tokens=False)
        normalized = tokenizer.normalizer.normalize_str(text)
        assert tokenizer.decode(result.ids, skip_special_tokens=False) == normalized
        assert all(0 <= i < config['vocab_size'] for i in result.ids)
        return dict(text=text, normalized=normalized, ids=result.ids, tokens=result.tokens,
                    display=[tokenizer.decode([i], skip_special_tokens=False) for i in result.ids])
    samples = []
    for label, text in [('中文与缩写', '你好，GPU！'), ('英文', 'Hello, GPU!'),
                        ('开头没有空格', 'hello'), ('开头有空格', ' hello'),
                        ('预组合字符 é', 'café'), ('组合字符 e + ◌́', 'cafe\u0301'),
                        ('数字与小数', '2026 3.1415926'), ('代码与缩进', 'def add(a, b):\n    return a + b'),
                        ('Emoji', '👩‍💻正在学习'), ('一次提问', '解释一下矩阵乘法。')]:
        chat = template.render(messages=[dict(role='user', content=text)],
                               tools=None, add_generation_prompt=True, enable_thinking=False)
        expected = '<|im_start|>user\n' + text + '<|im_end|>\n<|im_start|>assistant\n<think>\n\n</think>\n\n'
        assert chat == expected
        samples.append(dict(label=label, raw=encode(text), chat=encode(chat)))
    output = dict(model='Qwen/Qwen3-8B', revision=REVISION,
                  tokenizers=tokenizers.__version__, jinja2=jinja2.__version__,
                  source_sha256={name:hashlib.sha256(p.read_bytes()).hexdigest()
                                 for name,p in zip(['tokenizer.json','tokenizer_config.json','config.json'],files)},
                  config=config, template_mode=dict(add_generation_prompt=True, enable_thinking=False),
                  validation='All raw and chat encodings decode to NFC-normalized input; all IDs fit embedding rows.',
                  samples=samples)
    print(json.dumps(output, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
