#!/usr/bin/python3
from datetime import datetime, date
import sys
sys.path.insert(1, '../../')
from generate import generate
import gen_cfg

VERSION = sys.argv[1]
GENESIS_SU = sys.argv[2]
VALIDATOR_ADDR = sys.argv[3]
SILK_CONTRACT = sys.argv[4]
SILK_CODE_HASH = sys.argv[5]
SSCRT_CONTRACT = sys.argv[6]
SSCRT_CODE_HASH = sys.argv[7]

PATH = './src'
FILENAME = 'state.rs'

HEADER = \
f'''
/******************************************************************************

LGND-QUEST BACKEND {VERSION}
AUTOGENERATED {FILENAME.upper()} FILE

CREATED:        {date.today().strftime("%d %B %Y")}
AUTHOR:         YAESHA256
AFFILIATIONS:   AARTC (AART Consulting)
                                                                               
******************************************************************************/



'''

INJECTIONS = \
{
    "GENESIS_DATA" :
    f'''pub static GENESIS_SU: &str         = "{GENESIS_SU}";\n'''
}

generate(PATH, FILENAME, HEADER, INJECTIONS, gen_cfg.OUT_DIR )