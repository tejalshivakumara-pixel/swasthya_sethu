import os
import re
import json
import google.generativeai as genai
from PIL import Image


# ── API key setup ─────────────────────────────────────────────────────────────
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise EnvironmentError("GEMINI_API_KEY environment variable is not set.")
genai.configure(api_key=api_key)


PROMPT = """You are reading a photo of a medical prescription or medicine strip.
Extract every medicine you can identify. Respond ONLY with JSON, no markdown, in this exact shape:

{
  "medicines": [
    {"name": "string", "dosage": "string or null", "frequency": "string or null"}
  ],
  "diagnosis": "string or null",
  "raw_text_notes": "any other readable text, or null"
}

If the image is unreadable or not a prescription, return {"medicines": [], "diagnosis": null, "raw_text_notes": null}.
"""


def scan_prescription(image_path: str) -> dict:
    """
    Runs OCR/extraction on a prescription image via Gemini Vision.
    Returns a dict: {"medicines": [...], "diagnosis": ..., "raw_text_notes": ...}
    Never raises — returns an "error" key on failure so the UI can show a friendly message.
    """
    try:
        # ── Validate file exists ──────────────────────────────────────────────
        if not os.path.exists(image_path):
            return {
                "medicines": [],
                "diagnosis": None,
                "raw_text_notes": None,
                "error": f"File not found: {image_path}",
            }

        # ── Load image & call Gemini ──────────────────────────────────────────
        image    = Image.open(image_path)
        model    = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content([PROMPT, image])
        text     = response.text.strip()

        # ── Strip markdown code fences if model adds them ─────────────────────
        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?\s*", "", text)
            text = re.sub(r"\s*```$", "", text)

        return json.loads(text)

    except json.JSONDecodeError as e:
        return {
            "medicines": [],
            "diagnosis": None,
            "raw_text_notes": None,
            "error": f"Failed to parse Gemini response as JSON: {e}",
        }
    except Exception as e:
        return {
            "medicines": [],
            "diagnosis": None,
            "raw_text_notes": None,
            "error": str(e),
        }