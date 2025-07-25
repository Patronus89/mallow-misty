import fitz  # PyMuPDF
import re

# Read the PDF
doc = fitz.open('input/sample-invoice-english.pdf')
text = ''
for page in doc:
    text += page.get_text()
doc.close()

print('=== EXTRACTED TEXT ANALYSIS ===')
lines = text.split('\n')

print('First 20 lines:')
for i, line in enumerate(lines[:20]):
    print(f'{i:2d}: "{line}"')

print('\n=== VENDOR NAME SEARCH ===')
for i, line in enumerate(lines[:20]):
    if 'DEMO' in line or 'Sliced' in line:
        print(f'Line {i}: "{line}"')

print('\n=== AMOUNT ANALYSIS ===')
for i, line in enumerate(lines):
    if '$' in line:
        print(f'Line {i}: "{line}"')

print('\n=== REGEX TESTS ===')
# Test different patterns
patterns = [
    r'Total\s*\$(\d+\.\d+)',
    r'Total.*?\$\s*(\d+\.\d+)',
    r'\$(\d+\.\d+)',
]

for pattern in patterns:
    matches = re.findall(pattern, text)
    print(f'Pattern "{pattern}": {matches}')
