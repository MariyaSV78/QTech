import zlib, json, base64
import numpy as np

ZIPJSON_KEY = 'base64zipo'

def json_zip(j):
	out = {
		ZIPJSON_KEY: base64.b64encode(
			zlib.compress(
				json.dumps(j, cls=NumpyEncoder).encode('utf-8')
			)
		).decode('ascii')
	}

	return out

def json_zero(j):
	out = json.dumps(j, cls=NumpyEncoder)
#	out = json.loads(out)
	out = out.replace("NaN", "null")

	return out


# conversion of the object to dictionaire
def props(x):
    return dict((key, getattr(x, key)) for key in dir(x) if key not in dir(x.__class__))

# encoder of numpy arrays
class NumpyEncoder(json.JSONEncoder):
	def default(self, obj):
		if isinstance(obj, np.ndarray):
			return obj.tolist()
		return json.JSONEncoder.default(self, obj)
 
 
