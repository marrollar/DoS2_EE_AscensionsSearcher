# --------------------------------------------------------------------------------------------------------------------------
# Courtesy of Pip.
# Taken from https://github.com/PinewoodPip/ee2buildplanner/blob/master/public/Scripts/Icons/icon_ripper.py
# --------------------------------------------------------------------------------------------------------------------------


import math
import os
import re
import shutil
import warnings

from PIL import Image
from sql import ORM_DIR
from tqdm import tqdm

# outputs all sprites from an atlas as separate named .pngs. Requires the atlas image and its respective .lsx file (which is what contains the image names and UV maps)

# usage:
# >python icon_ripper.py {atlas filename}
# the appriopriate .lsx must exist within the directory

# note: Pillow does not support .dds, so you must export the atlases as png or some other format first.


# FILE = AMER_ICONS_IMGS
def rip_icons(DDS, LSX, move=False):
    img = Image.open(DDS)
    data = open(LSX)

    PIXEL_PERCENTAGE = (
        1 / img.size[0]
    )  # this is how much % of the width or height a pixel is. Used to figure out pixel values of each icon from its UV mapping. All sprite atlases seem to be square so we don't check both the width and height

    # regex for a sprite entry in the lsx files
    regex = re.compile("""
                    (<node id="IconUV">
                        <attribute id="MapKey" value="(?P<Id>.*)" type="22" />
                        <attribute id="U1" value="(?P<U1>.*)" type="6" />
                        <attribute id="U2" value="(?P<U2>.*)" type="6" />
                        <attribute id="V1" value="(?P<V1>.*)" type="6" />
                        <attribute id="V2" value="(?P<V2>.*)" type="6" />
                    </node>)""")

    search = re.findall(regex, data.read())
    count = 0
    for x in tqdm(search, desc="Extracting icons from dds file"):
        # apparently group names don't work when using findall so we map them again here
        iconData = {
            "Id": x[1],
            "U1": float(x[2]),
            "U2": float(x[3]),
            "V1": float(x[4]),
            "V2": float(x[5]),
        }

        # the uv values correspond to the center of a pixel (ex. (0.5, 0.5) is the first pixel), so we gotta shift the start X and Y coords by 1
        iconData["sx"] = math.ceil((iconData["U1"] / PIXEL_PERCENTAGE) - 1)
        iconData["ex"] = math.ceil((iconData["U2"] / PIXEL_PERCENTAGE) + 0)
        iconData["sy"] = math.ceil((iconData["V1"] / PIXEL_PERCENTAGE) - 1)
        iconData["ey"] = math.ceil((iconData["V2"] / PIXEL_PERCENTAGE) + 0)

        # crop the region
        region = (iconData["sx"], iconData["sy"], iconData["ex"], iconData["ey"])
        cropped = img.crop(region)
        filename = iconData["Id"] + ".png"

        cropped.save("artifact_icons/" + filename)
        count += 1

    if move:
        if os.path.exists(os.path.join(ORM_DIR, "artifact_icons")):
            warnings.warn(
                "Please remove existing icons folder in the web server before running the script."
            )
        else:
            shutil.move("artifact_icons", os.path.join(ORM_DIR, "artifact_icons"))