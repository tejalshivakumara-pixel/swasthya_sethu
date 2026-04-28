import streamlit as st
import streamlit.components.v1 as components
import os
import importlib.util as ilu

# ---------------------------------------------------
# PAGE CONFIG
# ---------------------------------------------------
st.set_page_config(
    page_title="Health Records — Swasthya Setu",
    page_icon="📋",
    layout="wide"
)

# ---------------------------------------------------
# IMPORT UTIL FUNCTIONS
# ---------------------------------------------------
_spec = ilu.spec_from_file_location(
    "util",
    os.path.join(os.path.dirname(__file__), "util.py")
)

_mod = ilu.module_from_spec(_spec)
_spec.loader.exec_module(_mod)

init_session = _mod.init_session
inject_css = _mod.inject_css
render_sidebar = _mod.render_sidebar

# ---------------------------------------------------
# INITIALIZE SESSION + SIDEBAR + THEME
# ---------------------------------------------------
init_session(); render_sidebar(); inject_css(st.session_state["theme"])

# ---------------------------------------------------
# HIDE STREAMLIT DEFAULT UI
# ---------------------------------------------------
st.markdown("""
<style>
    .block-container {
        padding: 0 !important;
        max-width: 100% !important;
    }

    #MainMenu {
        visibility: hidden;
    }

    footer {
        visibility: hidden;
    }

    header {
        visibility: hidden;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------
# LOAD CURRENT LANGUAGE
# ---------------------------------------------------
lang = st.session_state.get("language", "English")

# ---------------------------------------------------
# LOAD HTML FILE
# ---------------------------------------------------
html_path = os.path.join(
    os.path.dirname(__file__),
    "..",
    "health_records.html"
)

with open(html_path, "r", encoding="utf-8") as f:
    html_content = f.read()

# ---------------------------------------------------
# PASS LANGUAGE TO HTML
# ---------------------------------------------------
html_content = html_content.replace(
    "</head>",
    f"""
    <script>
        window.SWASTHYA_LANG = "{lang}";
    </script>
    </head>
    """
)

# ---------------------------------------------------
# ADD "INFO IS SAVED" POPUP SUPPORT
# ---------------------------------------------------
html_content = html_content.replace(
    "</body>",
    """
    <script>
        function showSavedMessage() {
            const popup = document.createElement("div");
            popup.innerText = "Info is saved";

            popup.style.position = "fixed";
            popup.style.bottom = "30px";
            popup.style.right = "30px";
            popup.style.background = "#4CAF50";
            popup.style.color = "white";
            popup.style.padding = "14px 24px";
            popup.style.borderRadius = "10px";
            popup.style.fontSize = "16px";
            popup.style.fontWeight = "600";
            popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
            popup.style.zIndex = "9999";

            document.body.appendChild(popup);

            setTimeout(() => {
                popup.remove();
            }, 3000);
        }

        // Example:
        // call showSavedMessage() after saving profile/vitals/allergy
    </script>
    </body>
    """
)

# ---------------------------------------------------
# RENDER HTML PAGE
# ---------------------------------------------------
components.html(
    html_content,
    height=1600,
    scrolling=True
)