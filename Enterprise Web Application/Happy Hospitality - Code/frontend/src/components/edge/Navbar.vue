<!-- @author Milou Hogendoorn -->

<template>
    <header :class="{ 'scrolled-nav': scrolledNav, 'admin-nav': isAdmin }">
        <nav>
            <div class='branding'>
                <router-link :to="{ name: 'home' }">
                    <img
                        alt='Logo HHC'
                        class='nav-branding'
                        src='https://files.stefankruik.com/branding/logo_banner.jpg'/>
                </router-link>
            </div>

            <!--General navbar: Admin button-->
            <ul v-show='!mobile'
                class='navigation'>
                <li v-if='isAdmin'>
                    <router-link
                        :class="{ 'active-link': $route.name === 'admin' }" :to="{ name: 'admin' }" class='link'>
                        Admin
                    </router-link>
                </li>

                <!--General navbar: Pillars dropdown-->
                <li v-if=true
                    class='dropdown-item'
                    @mouseleave='dropdownNavbar = false'
                    @mouseover='dropdownNavbar = true'>
                    <span class='link'>Pillars</span>
                    <ul v-show='dropdownNavbar'
                        :class="{'dropdown-navbar': !isAdmin, 'dropdown-navbar-admin': isAdmin}"
                        class='dropdown-navbar'>
                        <li>
                            <router-link
                                :class="{'active-link': $route.name === 'news' && $route.params.id === '0'}"
                                :to="{ name: 'news', params: { id: '0' } }"
                                class='link'
                                @click='closeDropdown'>
                                Challenges
                            </router-link>
                        </li>
                        <li>
                            <router-link
                                :class="{'active-link': $route.name === 'news' && $route.params.id === '1'}"
                                :to="{ name: 'news', params: { id: '1' } }"
                                class='link'
                                @click='closeDropdown'>
                                Research
                            </router-link>
                        </li>
                        <li>
                            <router-link
                                :class="{'active-link': $route.name === 'news' && $route.params.id === '2'}"
                                :to="{ name: 'news', params: { id: '2' } }"
                                class='link'
                                @click='closeDropdown'>
                                Networking
                            </router-link>
                        </li>
                    </ul>
                </li>

                <!--General navbar: -->
                <li v-if=true>
                    <router-link
                        :class="{ 'active-link': $route.name === 'about' }"
                        :to="{ name: 'about' }"
                        class='link'
                        @click='closeMobileNav'>
                        Over ons
                    </router-link>
                </li>

                <!--General navbar: Account button-->
                <li v-if='!isNotLoggedIn'
                    class='dropdown-item'
                    @mouseleave='dropdownNavbar = false'
                    @mouseover='dropdownNavbar = true'>
                    <span class='link'>Account</span>
                    <ul v-show='dropdownNavbar'
                        :class="{'dropdown-navbar': !isAdmin, 'dropdown-navbar-admin': isAdmin}"
                        class='dropdown-navbar'>
                        <li>
                            <router-link
                                :class="{'active-link': $route.name === 'account',}" :to="{ name: 'account' }"
                                class='link'
                                @click='closeDropdown'>
                                Profiel bewerken
                            </router-link>
                        </li>
                        <li @click='logout'>
                            <router-link
                                :class="{'active-link': $route.name === 'home',}" :to="{ name: 'home' }" class='link'>
                                Uitloggen
                            </router-link>
                        </li>
                    </ul>
                </li>

                <!--General navbar: Items when not logged in-->
                <li v-if='isNotLoggedIn'>
                    <router-link
                        :class="{ 'active-link': $route.name === 'register' }"
                        :to="{ name: 'register' }"
                        class='link'>
                        Registreren
                    </router-link>
                </li>
                <li v-if='isNotLoggedIn'>
                    <router-link
                        :class="{ 'active-link': $route.name === 'login' }"
                        :to="{ name: 'login' }"
                        class='link'>
                        Inloggen
                    </router-link>
                </li>
            </ul>

            <!--Icon for mobile navbar -->
            <div class='icon'>
                <i v-show='mobile'
                   :class="{ 'icon-active': mobileNav }"
                   class='fas fa-bars'
                   @click='toggleMobileNav'
                ></i>
            </div>

            <!--Mobile navbar: -->
            <transition name='mobile-nav'>
                <ul v-show='mobileNav'
                    :class="{ 'admin-nav': isAdmin }"
                    class='dropdown-nav'>

                    <!--Mobile navbar: Account dropdown-->
                    <li v-if='!isNotLoggedIn'
                        class='dropdown-item'
                        @mouseleave='dropdownNavbar = false'
                        @mouseover='dropdownNavbar = true'>
                        <span class='link'>Account</span>
                        <ul v-show='dropdownNavbar'
                            :class="{'dropdown-navbar': !isAdmin, 'dropdown-navbar-admin': isAdmin}"
                            class='dropdown-navbar-mobile'>
                            <li>
                                <router-link
                                    :class="{'active-link': $route.name === 'account', }"
                                    :to="{ name: 'account' }"
                                    class='link'
                                    @click='closeMobileNav'>
                                    Profiel bewerken
                                </router-link>
                            </li>
                            <li @click='logout'>
                                <router-link
                                    :class="{'active-link': $route.name === 'home',}"
                                    :to="{ name: 'home' }"
                                    class='link'
                                    @click='closeMobileNav'>
                                    Uitloggen
                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <!--Mobile navbar: General items-->
                    <li v-if='isNotLoggedIn'>
                        <router-link
                            :class="{ 'active-link': $route.name === 'login' }"
                            :to="{ name: 'login' }"
                            class='link'
                            @click='closeMobileNav'>
                            Inloggen
                        </router-link>
                    </li>
                    <li v-if='isNotLoggedIn'>
                        <router-link
                            :class="{'active-link': $route.name === 'register',}"
                            :to="{ name: 'register' }"
                            class='link'
                            @click='closeMobileNav'>
                            Registreren
                        </router-link>
                    </li>
                    <li v-if=true>
                        <router-link
                            :class="{ 'active-link': $route.name === 'about' }"
                            :to="{ name: 'about' }"
                            class='link'
                            @click='closeMobileNav'>
                            Over ons
                        </router-link>
                    </li>

                    <!--Mobile navbar: Pillars dropdown-->
                    <li v-if='true'
                        class='dropdown-item'
                        @mouseleave='dropdownNavbar = false'
                        @mouseover='dropdownNavbar = true'>
                        <span class='link'>Pillars</span>
                        <ul v-show='dropdownNavbar'
                            :class="{'dropdown-navbar': !isAdmin, 'dropdown-navbar-admin': isAdmin}"
                            class='dropdown-navbar-mobile'>
                            <li>
                                <router-link
                                    :class="{'active-link': $route.name === 'news' && $route.params.id === '0'}"
                                    :to="{ name: 'news', params: { id: '0' } }"
                                    class='link'
                                    @click='closeMobileNav'>
                                    Challenges
                                </router-link>
                            </li>
                            <li>
                                <router-link
                                    :class="{'active-link': $route.name === 'news' && $route.params.id === '1'}"
                                    :to="{ name: 'news', params: { id: '1' } }"
                                    class='link'
                                    @click='closeMobileNav'>
                                    Research
                                </router-link>
                            </li>
                            <li>
                                <router-link
                                    :class="{'active-link': $route.name === 'news' && $route.params.id === '2'}"
                                    :to="{ name: 'news', params: { id: '2' } }"
                                    class='link'
                                    @click='closeMobileNav'>
                                    Networking
                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <!--Mobile navbar: Admin button-->
                    <li v-if='isAdmin'>
                        <router-link
                            :class="{ 'active-link': $route.name === 'admin' }"
                            :to="{ name: 'admin' }"
                            class='link'
                            @click='closeMobileNav'>
                            Admin
                        </router-link>
                    </li>

                </ul>
            </transition>
        </nav>
    </header>
</template>

<script lang='js'>

import { fetchApi } from "@/utilities/networkController";
import { clearItems, getItem, setItem } from "@/utilities/sessionController";


export default {
    name: "NavBar",
    data() {
        return {
            isAdmin: false,
            isUserLoggedIn: false,
            dropdownNavbar: false,
            scrolledNav: null,
            mobile: null,
            mobileNav: null,
            windowWidth: null
        };
    },
    computed: {
        isNotLoggedIn() {
            return !this.isUserLoggedIn;
        }
    },
    created() {
        this.checkLoggedInStatus();
        window.addEventListener("resize", this.checkScreen);
        this.checkScreen();
    },
    mounted() {
        window.addEventListener("scroll", this.updateScroll);
    },
    methods: {
        toggleMobileNav() {
            this.mobileNav = !this.mobileNav;
        },
        updateScroll() {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 50) {
                this.scrolledNav = true;
                return;
            }
            this.scrolledNav = false;
        },
        checkScreen() {
            this.windowWidth = window.innerWidth;
            if (this.windowWidth <= 750) {
                this.mobile = true;
                return;
            }
            this.mobile = false;
            this.mobileNav = false;
        },
        closeMobileNav() {
            this.mobileNav = false;
        },
        async checkLoggedInStatus() {
            const userEmail = getItem("email");
            this.isUserLoggedIn = userEmail !== null;

            //Checks if the logged-in user is an admin
            if (this.isUserLoggedIn) {
                try {
                    const data = await fetchApi(`/superUsers/getByEmail/${userEmail}`, "GET");
                    if (data) {
                        this.isAdmin = true;
                        setItem("admin", true);
                        setItem("rank", data.admin ? "Administrator" : "Super User");
                    }
                } catch (error) {
                    console.error("Fout bij het ophalen van gebruikersgegevens:", error);
                }
            }
        },
        logout() {
            this.isAdmin = false;
            clearItems();
            this.checkLoggedInStatus();
            this.$router.push({ name: "home" });
        },
        closeDropdown() {
            this.dropdownNavbar = false;
        }
    }
};
</script>

<style scoped>
.dropdown-item {
    position: relative;
}

.dropdown-navbar {
    position: absolute;
    top: 100%;
    left: 0;
    width: 200px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    list-style: none;
    padding: 0;
    margin: 0;
    display: none;
}

.dropdown-navbar-mobile {
    position: static;
    top: 100%;
    left: 0;
    width: 200px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    list-style: none;
    padding: 0;
    margin: 0;
    display: none;
}

.dropdown-navbar {
    background-color: var(--main);
}

.dropdown-navbar-admin {
    background-color: var(--main-dark);
}

.dropdown-item:hover .dropdown-navbar,
.dropdown-item:hover .dropdown-navbar-admin {
    display: block;
}

header {
    /*if navbar needs to be shown at all times(position: fixed)*/
    position: fixed;
    background-color: var(--main);
    z-index: 2;
    width: 100%;
    transition: 0.5s ease all;
    color: var(--font-light);
}

header nav {
    position: relative;
    display: flex;
    flex-direction: row;
    padding: 12px 0;
    transition: 0.5s ease all;
    width: 90%;
    margin: 0 auto;
}

@media (max-width: 750px) {
    header nav {
        flex-direction: column;
    }

    header nav ul.navigation {
        display: none;
    }
}

header nav ul,
header nav .link {
    font-weight: 500;
    color: var(--font-dark);
    list-style: none;
    text-decoration: none;
}

header nav li {
    padding: 16px;
    margin-left: 16px;
}

header nav .link {
    font-size: 14px;
    transition: 0.5s ease all;
    padding-bottom: 4px;
    border-bottom: 1px solid transparent;
}

header nav .link:hover {
    border-color: var(--accent-b-hover);
}

header nav .branding {
    display: flex;
    align-items: center;
}

header nav .branding img {
    width: 130px;
    transition: 0.5s ease all;
}

header nav .navigation {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
}

header nav .icon {
    color: var(--font-dark);
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    right: 24px;
    height: 100%;
}

header nav .icon i {
    cursor: pointer;
    font-size: 24px;
    transition: 0.8s ease all;
}

header nav .icon-active {
    transform: rotate(180deg);
}

header nav .dropdown-nav.admin-nav {
    background-color: var(--main-dark);
}

header nav .dropdown-nav {
    display: flex;
    flex-direction: column;
    position: fixed;
    width: 100%;
    max-width: 250px;
    height: 100%;
    background-color: var(--main);
    top: 0;
    left: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

header nav .dropdown-nav li {
    margin-left: 0;
}

header nav .dropdown-nav .link {
    color: var(--font-dark);
}

header.admin-nav,
header.nav-mobile.admin-nav {
    background-color: var(--main-dark);
}

header.nav-mobile .dropdown-nav {
    background-color: var(--main-dark);
}

.mobile-nav-enter-active,
.mobile-nav-leave-active {
    transition: 1s ease all;
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
    transform: translateX(-250px);
}

.mobile-nav-enter-to {
    transform: translateX(0);
}

/* Styling when scrolling */
.scrolled-nav {
    background-color: var(--main);
}

.scrolled-nav nav {
    padding: 8px 0;
}

.scrolled-nav nav .branding img {
    width: 40px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Styling for the active navbar item*/
header nav .link.active-link {
    border-bottom: 2px solid var(--accent-b-hover);
}
</style>
