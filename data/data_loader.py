import tabula as tb
import pandas as pd
import re
import os

file_path = os.path.join(os.path.dirname(__file__), 'n-23-29-appendix-b.pdf')
data = tb.read_pdf(file_path, pages = '1')
print(data)