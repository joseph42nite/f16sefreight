<template>
    <nav class="sidebar-container">
        <!-- Desktop Sidebar -->
        <div class="sidebar d-none d-md-block">
            <ul class="sidebar__list">
                <!-- AWB / Consolidation -->
                <router-link to="/focus-air" custom v-slot="{ navigate }">
                    <li
                        class="sidebar__item"
                        :class="{ 'sidebar__item--active': isActive(['/focus-air', '/house-way-bill', '/consolidation', '/edit-airway-bill', '/edit-houseway-bill']) }"
                        @click="navigate"
                        role="link"
                        title="Focus Air"
                    >
                        <div class="sidebar__icon-wrap">
                            <img
                                :src="isActive(['/focus-air', '/house-way-bill', '/consolidation', '/edit-airway-bill', '/edit-houseway-bill'])
                                    ? '/media/assets/ui/side-menu/3-active.png'
                                    : '/media/assets/ui/side-menu/3.png'"
                                alt="Air Freight"
                            />
                        </div>
                    </li>
                </router-link>

                <!-- Message Log -->
                <router-link to="/message-log" custom v-slot="{ navigate }">
                    <li
                        class="sidebar__item"
                        :class="{ 'sidebar__item--active': isActive('/message-log') }"
                        @click="navigate"
                        role="link"
                        title="Message Log"
                    >
                        <div class="sidebar__icon-wrap">
                            <img
                                :src="isActive('/message-log')
                                    ? '/media/assets/ui/side-menu/4-active.png'
                                    : '/media/assets/ui/side-menu/4.png'"
                                alt="Message Log"
                            />
                        </div>
                    </li>
                </router-link>

                <!-- Rate -->
                <router-link to="/rate" custom v-slot="{ navigate }">
                    <li
                        class="sidebar__item"
                        :class="{ 'sidebar__item--active': isActive('/rate') }"
                        @click="navigate"
                        role="link"
                        title="Rate"
                    >
                        <div class="sidebar__icon-wrap">
                            <img
                                :src="isActive('/rate')
                                    ? '/media/assets/ui/side-menu/5-active.png'
                                    : '/media/assets/ui/side-menu/5.png'"
                                alt="Rate"
                            />
                        </div>
                    </li>
                </router-link>

                <!-- Bottom branding -->
                <li class="sidebar__branding">
                    <span class="sidebar__branding-text">FOCUS AIR</span>
                </li>
            </ul>
        </div>

        <!-- Mobile Dropdown Sidebar -->
        <div class="sidebar-mobile d-md-none" v-click-outside="closeMobileMenu">
            <div class="mobile-nav-trigger" @click="toggleMobileMenu">
                <img :src="activeItem.icon" class="mobile-active-icon" />
                <span class="mobile-active-label">{{ activeItem.label }}</span>
                <b-icon :icon="isMobileMenuOpen ? 'chevron-up' : 'chevron-down'" class="ml-auto"></b-icon>
            </div>
            <transition name="fade-slide">
                <div v-if="isMobileMenuOpen" class="mobile-nav-options">
                    <div 
                        v-for="item in menuItems" 
                        :key="item.label"
                        class="mobile-opt"
                        :class="{ active: isActive(item.activePaths) }"
                        @click="navigateMobile(item.path)"
                    >
                        <img :src="isActive(item.activePaths) ? item.activeIcon : item.icon" class="opt-icon" />
                        <span class="opt-label">{{ item.label }}</span>
                    </div>
                </div>
            </transition>
        </div>
    </nav>
</template>

<script>
export default {
    name: "SideBar",
    data() {
        return {
            primaryText: "/media/assets/ui/side-menu/H1-primary-text.svg",
            isMobileMenuOpen: false,
            menuItems: [
                { 
                    label: "Focus Air", 
                    path: "/focus-air", 
                    icon: "/media/assets/ui/side-menu/3.png", 
                    activeIcon: "/media/assets/ui/side-menu/3-active.png",
                    activePaths: ['/focus-air', '/house-way-bill', '/consolidation', '/edit-airway-bill', '/edit-houseway-bill']
                },
                { 
                    label: "Message Log", 
                    path: "/message-log", 
                    icon: "/media/assets/ui/side-menu/4.png", 
                    activeIcon: "/media/assets/ui/side-menu/4-active.png",
                    activePaths: ['/message-log']
                },
                { 
                    label: "Rate", 
                    path: "/rate", 
                    icon: "/media/assets/ui/side-menu/5.png", 
                    activeIcon: "/media/assets/ui/side-menu/5-active.png",
                    activePaths: ['/rate']
                }
            ]
        };
    },
    computed: {
        activeItem() {
            return this.menuItems.find(item => this.isActive(item.activePaths)) || this.menuItems[0];
        }
    },
    methods: {
        isActive(paths) {
            if (typeof paths === "string") paths = [paths];
            return paths.some((path) => {
                const regex = new RegExp(`^${path.replace(/:[^\s/]+/g, "[^/]+")}`);
                return regex.test(this.$route.path);
            });
        },
        toggleMobileMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
        },
        closeMobileMenu() {
            this.isMobileMenuOpen = false;
        },
        navigateMobile(path) {
            this.$router.push(path);
            this.isMobileMenuOpen = false;
        }
    },
};
</script>

<style scoped>
/* ── Container ─────────────────────────────────────────── */
.sidebar {
    width: 5%;
    min-width: 80px;
    height: 80vh;
    margin-right: 30px;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.sidebar__list {
    list-style: none;
    margin: 0;
    padding: 20px 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(16px) brightness(1.05);
    -webkit-backdrop-filter: blur(16px) brightness(1.05);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 32px;
    box-shadow: 0 8px 32px rgba(53, 85, 148, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    overflow: hidden;
    box-sizing: border-box;
}

.sidebar__item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 0;
    cursor: pointer;
}

.sidebar__icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    transition: transform 0.2s ease;
}

.sidebar__icon-wrap img {
    width: 32px;
    height: 32px;
    display: block;
    object-fit: contain;
}

.sidebar__branding {
    margin-top: auto;
    display: flex;
    justify-content: center;
    padding: 24px 0 20px;
}

.sidebar__branding-text {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-family: 'Inter', sans-serif;
    font-weight: 900;
    letter-spacing: -0.02em;
    font-size: 18px;
    color: #355594;
    white-space: nowrap;
    opacity: 0.9;
}

/* ── Mobile Dropdown Styles ───────────────────────────── */
.sidebar-mobile {
    width: 100%;
    margin-bottom: 20px;
    position: relative;
    z-index: 1001;
}

.mobile-nav-trigger {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(53, 85, 148, 0.2);
    border-radius: 20px;
    height: 60px;
    padding: 0 20px;
    cursor: pointer;
    box-shadow: 0 8px 32px rgba(53, 85, 148, 0.1);
}

.mobile-active-icon {
    width: 28px;
    height: 28px;
    margin-right: 12px;
}

.mobile-active-label {
    color: #355594;
    font-weight: 700;
    font-size: 16px;
    margin-right: 20px;
}

.mobile-nav-options {
    position: absolute;
    top: calc(100% + 12px);
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    padding: 10px;
}

.mobile-opt {
    display: flex;
    align-items: center;
    padding: 14px 16px;
    border-radius: 16px;
    transition: all 0.2s ease;
    cursor: pointer;
    margin-bottom: 4px;
}

.mobile-opt:last-child {
    margin-bottom: 0;
}

.opt-icon {
    width: 24px;
    height: 24px;
    margin-right: 14px;
}

.opt-label {
    color: #475569;
    font-weight: 600;
    font-size: 15px;
}

.mobile-opt:hover {
    background: rgba(53, 85, 148, 0.05);
}

.mobile-opt.active {
    background: rgba(53, 85, 148, 0.1);
}

.mobile-opt.active .opt-label {
    color: #355594;
}

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter, .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-15px);
}
</style>
