<template>
  <div
    class="sidebar"
    :data-color="sidebarItemColor"
    :data-image="sidebarBackgroundImage"
    :style="sidebarStyle"
  >
    <div class="logo">
      <!-- SVG hospital: Cruz médica moderna -->
      <span class="hospital-logo-svg">
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
          <rect x="20" y="6" width="8" height="36" rx="2" fill="#1976d2"/>
          <rect x="6" y="20" width="36" height="8" rx="2" fill="#1976d2"/>
          <rect x="22" y="8" width="4" height="32" rx="1" fill="#fff"/>
          <rect x="8" y="22" width="32" height="4" rx="1" fill="#fff"/>
        </svg>
      </span>
      <span class="simple-text logo-normal">
        NeoLife
      </span>
    </div>
    <div class="sidebar-wrapper">
      <slot name="content"></slot>
      <md-list class="nav">
        <slot>
          <sidebar-link
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
            :to="link.path"
            :link="link"
          ></sidebar-link>
        </slot>
      </md-list>
    </div>
  </div>
</template>

<script>
import SidebarLink from "./SidebarLink.vue";

export default {
  name: "Sidebar",
  components: {
    SidebarLink,
  },
  props: {
    title: {
      type: String,
      default: "NeoLife",
    },
    sidebarBackgroundImage: {
      type: String,
      default: require("@/assets/img/sidebar-2.jpg"),
    },
    imgLogo: {
      type: String,
      default: require("@/assets/img/vue-logo.png"),
    },
    sidebarItemColor: {
      type: String,
      default: "green",
      validator: (value) => {
        let acceptedValues = ["", "purple", "blue", "green", "orange", "red"];
        return acceptedValues.indexOf(value) !== -1;
      },
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      autoClose: this.autoClose,
    };
  },
  computed: {
    sidebarStyle() {
      return {
        backgroundImage: `url(${this.sidebarBackgroundImage})`,
      };
    },
  },
};
</script>

<style>
.sidebar {
  background: #e3f2fd;
  color: #0d47a1;
  min-width: 220px;
  max-width: 240px;
  height: 100vh;
  box-shadow: 2px 0 18px 0 #0001;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 26px 0 16px 0;
  border-bottom: 1px solid #bbdefb;
  background: #1976d2;
  gap: 14px;
}

.hospital-logo-svg {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 6px #0002;
}

.simple-text.logo-normal {
  color: #fff;
  font-size: 1.16em;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: 'Roboto Mono', 'Roboto', monospace;
  margin-left: 5px;
}

.sidebar-wrapper {
  flex: 1;
  margin-top: 18px;
  padding: 0 0 30px 0;
  overflow-y: auto;
}

.md-list.nav {
  margin: 0;
  padding: 0;
}
.sidebar-link {
  display: flex;
  align-items: center;
  padding: 13px 22px;
  border-radius: 8px;
  margin: 0 10px 8px 10px;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
}
.sidebar-link:hover,
.sidebar-link.router-link-exact-active {
  background: #bbdefb;
}
.sidebar-text {
  margin-left: 12px;
  font-weight: 500;
  font-size: 1.06em;
  color: #145ea8;
}

.icon-blue { color: #1976d2 !important; }
.icon-green { color: #43a047 !important; }
.icon-accent { color: #fbc02d !important; }
.icon-grey { color: #757575 !important; }

@media (max-width: 900px) {
  .sidebar {
    min-width: 56px;
    max-width: 56px;
  }
  .sidebar-text, .simple-text.logo-normal {
    display: none;
  }
  .logo {
    padding: 20px 0 10px 0;
  }
  .hospital-logo-svg svg {
    width: 28px;
    height: 28px;
  }
}
</style>