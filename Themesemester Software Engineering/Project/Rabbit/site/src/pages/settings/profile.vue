<script setup lang="ts">
import { ButtonComponent as Button } from '#components';
import { FileTypes, ToastTypes, type ProfileDetailsPayload, type ToastItem } from '~/assets/customTypes';
import { useFetchProfileDetails } from '~/utils/fetch/user/useFetchProfileDetails';
import { useFetchUpdateProfileDetails } from '~/utils/fetch/user/useFetchUpdateProfileDetails';
const userStore = useUserStore();
const { $event } = useNuxtApp();

// Reactive Data
const formData = reactive({
    hopperId: userStore.user.id,
    description: "",
    socials: [] as Array<{ name: string; url: string }>,
    avatar: "",
    banner: "",
    isNsfw: false
} as ProfileDetailsPayload);
const avatarInput: Ref<File | null> = ref(null);
const bannerInput: Ref<File | null> = ref(null);

// Lifecycle Hooks
onMounted(async () => {
    try {
        const rawData = await useFetchProfileDetails(userStore.user.id);
        formData.description = rawData.description || "";
        formData.socials = rawData.socials || [];
        formData.avatar = rawData.avatar || "";
        formData.banner = rawData.banner || "";
        formData.isNsfw = Boolean(rawData.isNsfw);
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.warning,
            message: error.message || "Failed to load profile details.",
            duration: 3,
        } as ToastItem);
    }
});

// Methods

/**
 * Submits the form data when the user clicks the submit button.
 * @param event The form submission event.
 */
async function submitForm(event: Event): Promise<void> {
    try {
        event.preventDefault();

        const multipart = new FormData();
        multipart.append("profileDetails", JSON.stringify(formData));
        if (avatarInput.value) multipart.append("avatar", avatarInput.value);
        if (bannerInput.value) multipart.append("banner", bannerInput.value);

        await useFetchUpdateProfileDetails(multipart);
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.success,
            message: "Profile updated successfully.",
            duration: 3,
        } as ToastItem);
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.warning,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

/**
 * Sets the file input for profile picture or banner.
 *
 * @param event The event triggered by the file input change.
 * @param type The type of file input (avatar or banner).
 */
function setFile(event: Event, type: "avatar" | "banner"): void {
    try {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];

            // Check if the file is an image
            if (!file.type.startsWith("image/"))
                throw new Error(
                    "Invalid file type. Please select an image file like JPG or PNG."
                );

            if (type === "avatar") {
                if (!formData.avatar) formData.avatar = createTicket();
                avatarInput.value = file;
            } else if (type === "banner") {
                if (!formData.banner) formData.banner = createTicket();
                bannerInput.value = file;
            }

            // No image selected, reset the input
        } else if (type === "avatar") {
            delete formData.avatar;
        } else if (type === "banner") delete formData.banner;
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

/**
 * Create an image preview URL for the profile picture or banner.
 *
 * @param type The type of image to create (profilePicture or banner).
 */
function createImg(type: "avatar" | "banner"): string {
    if (type === "avatar") {
        return avatarInput.value
            ? URL.createObjectURL(avatarInput.value)
            : getFilePath(formData.avatar, FileTypes.hopperAvatar);
    } else
        return bannerInput.value
            ? URL.createObjectURL(bannerInput.value)
            : getFilePath(formData.banner, FileTypes.hopperBanner);
}
</script>

<template>
    <form @submit="submitForm" class="flex flex-col gap-8 max-w-80">
        <div class="flex flex-col gap-2 relative">
            <h2 class="text-xl font-bold">General</h2>
            <p class="text-sm mb-4 text-font-light">Customize your information.</p>
            <label for="description" class="text-sm">Description</label>
            <textarea v-model="formData.description" maxlength="250" id="description" name="description"
                class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none resize-none h-32"></textarea>
            <p class="text-xs text-orange-500 text-right absolute right-2 top-52 mt-2 pointer-events-none">
                {{ formData.description.length }}/250
            </p>
            <!-- <label class="text-sm mt-4">Socials</label> -->
        </div>
        <div class="flex flex-col gap-2 items-center">
            <h2 class="text-xl font-bold w-full">Images</h2>
            <p class="text-sm mb-4 text-font-light w-full">Style your avatar & banner.</p>
            <img :src="createImg('avatar')" class="w-20 h-20 rounded-full object-cover" alt="Avatar" />
            <input type="file" id="avatar" accept="image/*" name="avatar" @change="setFile($event, 'avatar')"
                class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none" />
            <img :src="createImg('banner')" class="h-20 w-60 rounded object-cover" alt="Banner" />
            <input type="file" id="banner" accept="image/*" name="banner" @change="setFile($event, 'banner')"
                class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none" />
        </div>
        <div class="flex flex-col gap-2">
            <h2 class="text-xl font-bold">NSFW</h2>
            <p class="text-sm mb-4 text-font-light">Do you post 18+ content? This is to protect other Hoppers, so
                please be honest. 18+ can range from adult videos to graphic content.</p>
            <label class="inline-flex items-center me-5 cursor-pointer">
                <input v-model="formData.isNsfw" type="checkbox" value="" class="sr-only peer" checked />
                <div
                    class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover">
                </div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">I post sensitive
                    content.</span>
            </label>
        </div>
        <Button type="submit" label="Save Changes" classname="w-40 h-8"></Button>
    </form>
</template>