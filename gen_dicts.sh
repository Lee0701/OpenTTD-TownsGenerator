#!/bin/bash
in_codes="bg hr cs da nl en et fi fr de el hu ga it lv lt mt pl pt ro sk sl es sv"

# for code in $in_codes; do
#     echo $code
#     node --max-old-space-size=12000 gen_dict.js data/wikidatawiki-20231220-wb_items_per_site.sql ${code}wiki data/dicts/${code}.tsv
# done

# in_files=""
# for code in $in_codes; do
#     in_files="$in_files data/dicts/${code}.tsv"
# done
# node --max-old-space-size=12000 filter_dicts.js data/allCountries.txt ${in_files}

in_files=""
for code in $in_codes; do
    in_files="$in_files data/dicts/${code}_f.tsv"
done
node --max-old-space-size=12000 merge_dicts.js data/merged_dict.tsv ${in_files}
