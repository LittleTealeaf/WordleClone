import json

with open('./words.txt') as f_in:
    with open('./words.json','w') as f_out:
        f_out.write(json.dumps([word.replace('\n','') for word in f_in.readlines()]))
