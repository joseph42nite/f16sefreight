<template>
    <nav class="sidebar-container">
        <!-- Desktop Sidebar -->
        <div class="sidebar d-none d-lg-block" :class="{ 'sidebar-mini': collapsed }">
            <ul class="sidebar__list">
                <router-link 
                    v-for="item in menuItems" 
                    :key="item.label" 
                    :to="item.path" 
                    custom 
                    v-slot="{ navigate }"
                >
                    <li
                        class="sidebar__item"
                        :class="{ 'sidebar__item--active': isActive(item.activePaths) }"
                        @click="navigate"
                        role="link"
                        :title="item.label"
                    >
                        <div class="sidebar__icon-wrap">
                            <b-icon 
                                :icon="item.icon" 
                                font-scale="1.8" 
                                :style="{ color: isActive(item.activePaths) ? '#355594' : '#64748B' }"
                                class="nav-icon"
                            ></b-icon>
                        </div>
                    </li>
                </router-link>

                <!-- Bottom branding -->
                <li v-if="!collapsed" class="sidebar__branding">
                    <span class="sidebar__branding-text">FOCUS AIR</span>
                </li>
            </ul>
        </div>

        <!-- Mobile Dropdown Sidebar -->
        <div class="sidebar-mobile d-lg-none" v-click-outside="closeMobileMenu">
            <div class="mobile-nav-trigger" @click="toggleMobileMenu">
                <b-icon :icon="activeItem.icon" class="mobile-active-icon text-primary font-scale-1.3"></b-icon>
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
                        <b-icon :icon="item.icon" class="opt-icon mr-3" :style="{ color: isActive(item.activePaths) ? '#355594' : '#64748B' }"></b-icon>
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
    props: {
        collapsed: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            primaryText: "/media/assets/ui/side-menu/H1-primary-text.svg",
            isMobileMenuOpen: false
        };
    },
    computed: {
        currentUser() {
            return this.$store.getters.currentUser;
        },
        companyTier() {
            return this.currentUser && this.currentUser.company ? this.currentUser.company.tier : 'viper_core';
        },
        menuItems() {
            const isSales = this.currentUser && this.currentUser.designation === 'sales';
            const isBoss  = this.currentUser && this.currentUser.designation === 'boss';

            // Sales role sees a stripped-down sidebar: Analytics, Mailbox, Kanban only
            if (isSales) {
                return [
                    {
                        label: "Analytics",
                        path: "/analytics",
                        icon: "bar-chart",
                        activePaths: ['/analytics']
                    },
                    {
                        label: "Mail/Inbox",
                        path: "/inbox",
                        icon: "mailbox",
                        activePaths: ['/inbox']
                    },
                    {
                        label: "Kanban Board",
                        path: "/kanban",
                        icon: "grid-3x3-gap",
                        activePaths: ['/kanban']
                    },
                ];
            }

            // Boss sees Analytics, Inbox, Kanban — and Financials if Command tier
            if (isBoss) {
                const bossList = [
                    {
                        label: "Analytics",
                        path: "/analytics",
                        icon: "bar-chart",
                        activePaths: ['/analytics']
                    },
                    {
                        label: "Mail/Inbox",
                        path: "/inbox",
                        icon: "mailbox",
                        activePaths: ['/inbox']
                    },
                    {
                        label: "Kanban Board",
                        path: "/kanban",
                        icon: "grid-3x3-gap",
                        activePaths: ['/kanban']
                    },
                ];
                if (this.companyTier === 'viper_command') {
                    bossList.push({
                        label: "Financials",
                        path: "/financials",
                        icon: "cash",
                        activePaths: ['/financials']
                    });
                }
                return bossList;
            }

            const list = [
                {
                    label: "Mail/Inbox",
                    path: "/inbox",
                    icon: "mailbox",
                    activePaths: ['/inbox']
                },
                {
                    label: "Kanban Board",
                    path: "/kanban",
                    icon: "grid-3x3-gap",
                    activePaths: ['/kanban']
                },
                { 
                    label: "Focus Air Export", 
                    path: "/focus-air", 
                    icon: "file-earmark-text", 
                    activePaths: ['/focus-air', '/consolidation', '/edit-airway-bill']
                },
                { 
                    label: "Focus Air Import", 
                    path: "/focus-air-import", 
                    icon: "file-earmark-arrow-down", 
                    activePaths: ['/focus-air-import']
                },
            ];

            // Hide Financials for viper_core and viper_tactical (only show for viper_command)
            if (this.companyTier === 'viper_command') {
                list.push({
                    label: "Financials",
                    path: "/financials",
                    icon: "cash",
                    activePaths: ['/financials']
                });
            }

            // Hide Analytics for operations & pricing designations
            const isExcludedRole = this.currentUser && (this.currentUser.designation === 'operations' || this.currentUser.designation === 'pricing');
            if (!isExcludedRole) {
                list.push({
                    label: "Analytics",
                    path: "/analytics",
                    icon: "bar-chart",
                    activePaths: ['/analytics']
                });
            }

            return list;
        },
        activeItem() {
            return this.menuItems.find(item => this.isActive(item.activePaths)) || this.menuItems[0];
        }
    },
    methods: {
        isActive(paths) {
            if (typeof paths === "string") paths = [paths];
            return paths.some((path) => {
                const regex = new RegExp(`^${path.replace(/:[^\s/]+/g, "[^/]+")}(?:/|$)`);
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
    transition: all 0.3s ease;
}

.sidebar.sidebar-mini {
    min-width: 60px;
    width: 60px;
    margin-right: 15px;
}

.sidebar__list {
    list-style: none;
    margin: 0;
    padding: 24px 0;
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
    gap: 18px;
    overflow: hidden;
    box-sizing: border-box;
}

.sidebar__item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 0;
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
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.sidebar__item:hover .sidebar__icon-wrap {
    transform: scale(1.2);
}

.sidebar__item--active {
    background: linear-gradient(90deg, rgba(53, 85, 148, 0.12) 0%, rgba(53, 85, 148, 0.03) 100%);
    border-right: 3px solid #355594;
    transition: all 0.3s ease;
}

.sidebar__branding {
    margin-top: auto;
    display: flex;
    justify-content: center;
    padding: 24px 0 10px;
}

.sidebar__branding-text {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    letter-spacing: 0.03em;
    font-size: 16px;
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
    margin-right: 12px;
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
    font-size: 1.25rem;
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
