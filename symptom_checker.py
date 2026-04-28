import streamlit as st
import streamlit.components.v1 as components
import os
import importlib.util as ilu

st.set_page_config(page_title="AI Symptom Checker — Swasthya Setu", page_icon="🤖", layout="wide")

_spec = ilu.spec_from_file_location("util", os.path.join(os.path.dirname(__file__), "util.py"))
_mod  = ilu.module_from_spec(_spec); _spec.loader.exec_module(_mod)
init_session = _mod.init_session; inject_css = _mod.inject_css; render_sidebar = _mod.render_sidebar

init_session(); render_sidebar(); inject_css(st.session_state["theme"])
st.markdown("""
<style>
    .block-container { padding: 0 !important; max-width: 100% !important; }
    #MainMenu { visibility: hidden; } footer { visibility: hidden; } header { visibility: hidden; }
</style>""", unsafe_allow_html=True)

lang = st.session_state.get("language", "English")
html_path = os.path.join(os.path.dirname(__file__), '..', 'symptom_checker.html')
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()
html_content = html_content.replace('</head>', f'<script>window.SWASTHYA_LANG = "{lang}";</script></head>')
components.html(html_content, height=1400, scrolling=True)