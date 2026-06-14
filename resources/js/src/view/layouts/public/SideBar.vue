<template>
    <nav class="sidebar-container">
        <!-- Desktop Sidebar -->
        <div class="sidebar d-none d-lg-block">
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
                            <img src="/media/assets/ui/side-menu/3.png" alt="Air Freight" />
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
                            <img src="/media/assets/ui/side-menu/4.png" alt="Message Log" />
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
        <div class="sidebar-mobile d-lg-none" v-click-outside="closeMobileMenu">
            <div class="mobile-nav-trigger" @click="toggleMobileMenu">
                <img :src="activeItem.icon" class="mobile-active-icon" />
                <span class="mobile-active-label">{{ activeItem.label }}</span>
                <b-icon icon="chevron-down" class="ml-auto chevron-icon" :class="{ 'rotated': isMobileMenuOpen }"></b-icon>
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
                        <img :src="item.icon" class="opt-icon" />
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
                    activePaths: ['/focus-air', '/house-way-bill', '/consolidation', '/edit-airway-bill', '/edit-houseway-bill']
                },
                { 
                    label: "Message Log", 
                    path: "/message-log", 
                    icon: "/media/assets/ui/side-menu/4.png", 
                    activePaths: ['/message-log']
                },
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
.sidebar-container a, 
.sidebar-container a:focus, 
.sidebar-container a:active {
    outline: none !important;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
}

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
    padding: 16px 0;
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
}

.sidebar__item:focus {
    outline: none;
}

.sidebar__icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.2s ease;
}

.sidebar__item:hover .sidebar__icon-wrap {
    transform: scale(1.15);
}

.sidebar__item--active {
    background: linear-gradient(90deg, rgba(53, 85, 148, 0.15) 0%, rgba(53, 85, 148, 0.05) 100%);
    border-right: 3px solid #355594;
    transition: all 0.3s ease;
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
    font-weight: 700;
    letter-spacing: 0.03em;
    font-size: 18px;
    line-height: 1;
    color: #355594;
    white-space: nowrap;
    opacity: 0.95;
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
    transition: all 0.3s ease;
}

.mobile-nav-trigger:active {
    transform: scale(0.97);
    transition: all 0.1s ease;
}

.chevron-icon {
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chevron-icon.rotated {
    transform: rotate(180deg);
}

.mobile-active-icon {
    width: 28px;
    height: 28px;
    margin-right: 12px;
    object-fit: contain;
    flex-shrink: 0;
}

.mobile-active-label {
    color: #355594;
    font-weight: 900;
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
    object-fit: contain;
    flex-shrink: 0;
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
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.fade-slide-enter, .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.97);
}
</style>
