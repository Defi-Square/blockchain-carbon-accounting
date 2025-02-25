import requests
from common import logging

import config


def tokenize(issuee, input_file_name):
    form_data = {"issuee": issuee}
    files = {
        'input': open(input_file_name, 'rb')
    }
    try:
        res = requests.post(config.API_BASE_URL + "/issue", data=form_data, files=files, verify=True)
        return res.json()
    except requests.exceptions.ConnectionError:
        return None
    except Exception as e:
        logging.error(e)
        return None

