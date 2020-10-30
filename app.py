import random
import json
import subprocess

# change this line to path to your node.js executable
subprocess.call(['C:\\Program Files\\nodejs\\node.exe', './app.js'])

match_count = int(input('Kaç maçlık olsun?: '))
max_odd = float(input('Max oran?: '))
min_odd = float(input('Min oran?: '))

with open('./data.json') as data:
  matches = json.load(data)

filtered = {}

for match in matches:
  odds = []
  for odd in matches[match]:
    odd_of_the_current_match = 0
    try:
      odd_of_the_current_match = float(matches[match][odd])
    except:
      odd_of_the_current_match = 0
    if min_odd <= odd_of_the_current_match <= max_odd: 
      odds.append(f'{odd_of_the_current_match} - {odd}')
  if odds:
    filtered[match] = random.choice(odds)

result = random.sample(list(filtered.items()), match_count)
for match in result:
  print(match)
