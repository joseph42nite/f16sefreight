<template>
    <ul class="list-unstyled">
        <!-- Redirect to dashboard -->
        <router-link to="#" :class="{ active: isActive('/dashboard') }">
            <li :style="{ padding: isActive('/dashboard') ? '10px 0px' : '10px 15px' }">
                <img :src="isActive('/dashboard') ? '/media/custome/side-menu/1-active.png' : '/media/custome/side-menu/1.png'" alt="one">
            </li>
        </router-link>
        <!-- Redirect to stock management -->
        <router-link to="#" :class="{ active: isActive('/stock') }">
            <li :style="{ padding: isActive('/stock') ? '10px 0px' : '10px 15px' }">
                <img :src="isActive('/stock') ? '/media/custome/side-menu/2-active.png' : '/media/custome/side-menu/2.png'" alt="two">
            </li>
        </router-link>
        <!-- Redirect to Documentation /web-doc/houseway bill/consolidation -->
        <router-link to="/web-doc" :class="{ active: isActive(['/web-doc', '/house-way-bill', '/consolidation', '/edit-airway-bill', '/edit-houseway-bill']) }">
            <li :style="{ padding: isActive(['/web-doc', '/house-way-bill', '/consolidation', '/edit-airway-bill', '/edit-houseway-bill']) ? '10px 0px' : '10px 15px' }">
                <img :src="isActive(['/web-doc', '/house-way-bill', '/consolidation', '/edit-airway-bill', '/edit-houseway-bill']) ? '/media/custome/side-menu/3-active.png' : '/media/custome/side-menu/3.png'" alt="three">
            </li>
        </router-link>
        <!-- Redirect to search -->
        <router-link to="/message-log" :class="{ active: isActive('/message-log') }">
            <li :style="{ padding: isActive('/message-log') ? '10px 0px' : '10px 15px' }">
                <img :src="isActive('/message-log') ? '/media/custome/side-menu/4-active.png' : '/media/custome/side-menu/4.png'" alt="four">
            </li>
        </router-link>
        <!-- Redirect to rating -->
        <router-link to="/rate" :class="{ active: isActive('/rate') }">
            <li :style="{ padding: isActive('/rate') ? '10px 0px' : '10px 15px' }">
                <img :src="isActive('/rate') ? '/media/custome/side-menu/5-active.png' : '/media/custome/side-menu/5.png'" alt="five">
            </li>
        </router-link>
        <router-link to="/dashboard">
            <li class="sideBarLevelText">
                <img :src="primaryText" alt="Primary Text" class="primary-text">
            </li>
        </router-link>
    </ul>
</template>

<script>
  export default {
    name: "SideBar",
    data(){
        return{
            primaryText: "/media/custome/side-menu/H1-primary-text.svg",
        }
    },
    methods: {
        // Method to check if the current route matches the link
        // isActive(path) {
        //     return path.includes(this.$route.path);
        // }
        isActive(paths) {
            // Ensure paths is an array, even if it's a single string
            if (typeof paths === 'string') {
                paths = [paths];
            }
            console.log(paths);
            // Check if the current route matches any of the paths
            return paths.some(path => {
                // Handle dynamic segments in the path
                const regex = new RegExp(`^${path.replace(/:[^\s/]+/g, '[^/]+')}`);
                return regex.test(this.$route.path);
            });
        }
    },

  };
  </script>
<style scoped>
img {
    width: 100%;
}
ul {
    width:4.5%;
    height: 80vh;
    background-color: #F2F9FF;
    padding: 20px 0px;
    border: 1px solid #F2F9FF;
    border-radius: 24px;
    box-shadow: 3px 3px 10px #d0d0d0;
    z-index: 1;
    margin: 0% 2% 0% 0%;
}
.sideBarLevelText {
    text-align: center;
}
.primary-text {
    width: 15px;
    margin-top: 130px;
}
</style>