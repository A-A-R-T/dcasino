#!/usr/bin/python3
from datetime import datetime, date
import sys
sys.path.insert(1, '../')
from generate import generate
import gen_cfg

VERSION = sys.argv[1]
GENESIS_SU = sys.argv[2]

PATH = './src'
FILENAME = 'state.rs'

HEADER = \
f'''
/******************************************************************************

PVP BACKEND {VERSION}
AUTOGENERATED {FILENAME.upper()} FILE

CREATED:        {date.today().strftime("%d %B %Y")}
AUTHOR:         YAESHA256, Chef Luigi, Jensei
AFFILIATIONS:   --
                                                                               
******************************************************************************/



'''

INJECTIONS = \
{
    "GENESIS_SU" :
    f'''pub static GENESIS_SU: &str = "{GENESIS_SU}";\n''',

}

generate(PATH, FILENAME, HEADER, INJECTIONS, gen_cfg.OUT_DIR )