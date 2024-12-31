<template>
    <ul class="list-unstyled">
        <router-link to="/dashboard">
            <li>
                <img :src="one" alt="one">
            </li>
        </router-link>
        <router-link to="/dashboard">
            <li>
                <img :src="two" alt="two">
            </li>
        </router-link>
        <router-link to="/dashboard">
            <li>
                <img :src="three" alt="three">
            </li>
        </router-link>
        <router-link to="/dashboard">
            <li>
                <img :src="four" alt="four">
            </li>
        </router-link>
        <router-link to="/dashboard">
            <li>
                <img :src="five" alt="five">
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
            one: "/media/custome/side-menu/1.svg",
            two: "/media/custome/side-menu/2.svg",
            three: "/media/custome/side-menu/3.svg",
            four: "/media/custome/side-menu/4.svg",
            five: "/media/custome/side-menu/5.svg",
            primaryText: "/media/custome/side-menu/H1-primary-text.svg",
        }
    },
  };
  </script>
<style scoped>
img {
    width:35px;
    padding: 15px 0px;
}
ul {
    height: 80vh;
    background-color: #F2F9FF;
    padding: 20px 15px;
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
    width:12px;
    margin-top: 90px;
}
</style>