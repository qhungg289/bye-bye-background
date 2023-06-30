<script setup>
import { useDropZone, useFileDialog } from "@vueuse/core";
import { ref } from "vue";
import UploadIcon from "./components/icon/UploadIcon.vue";
import Button from "./components/Button.vue";
import LoadingOverlay from "./components/LoadingOverlay.vue";
import Error from "./components/Error.vue";
import imglyRemoveBackground from "@imgly/background-removal";

const dropZoneRef = ref();
const uploadedImage = ref();
const resultImage = ref();
const isInvalid = ref(false);
const isLoading = ref(false);

async function removeBg(files) {
    if (
        !files[0].type.includes("image/jpeg") &&
        !files[0].type.includes("image/png")
    ) {
        isInvalid.value = true;
        return;
    }

    isInvalid.value = false;
    uploadedImage.value = URL.createObjectURL(files[0]);

    isLoading.value = true;

    imglyRemoveBackground(files[0])
        .then((blob) => {
            resultImage.value = URL.createObjectURL(blob);
            isLoading.value = false;
            console.log(resultImage.value);
        })
        .catch((e) => {
            console.error(e);
            isLoading.value = false;
        });
}

function download() {
    const a = document.createElement("a");
    a.href = resultImage.value;
    a.download = `${Date.now()}.png`;
    a.click();
}

function reset() {
    uploadedImage.value = null;
    resultImage.value = null;
}

const { isOverDropZone } = useDropZone(dropZoneRef, removeBg);
const { open, onChange } = useFileDialog();

onChange(removeBg);
</script>

<template>
    <main class="flex flex-col items-center">
        <a
            href="/"
            class="text-xl my-8 border border-neutral-800 bg-neutral-900/50 backdrop-blur-md px-6 py-3 rounded-full"
            >👋 Bye bye background</a
        >
        <div
            v-if="resultImage"
            class="grid md:grid-cols-[4fr_1fr_4fr] justify-items-center gap-4 mb-8"
        >
            <div
                class="hidden md:block p-4 mx-4 rounded-md bg-neutral-900 place-self-start"
            >
                <img
                    :src="uploadedImage"
                    class="border border-neutral-800 rounded"
                />
                <p class="text-center mt-4">Original</p>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="hidden md:block w-10 h-w-10 place-self-center"
            >
                <path
                    fill-rule="evenodd"
                    d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                    clip-rule="evenodd"
                />
            </svg>
            <div class="flex flex-col items-center gap-2">
                <div class="p-4 mx-4 rounded-md bg-neutral-900">
                    <img
                        :src="resultImage"
                        class="border border-neutral-800 bg-black rounded"
                        id="result-image"
                    />
                    <p class="text-center mt-4">Result</p>
                </div>
                <div class="flex items-center gap-2">
                    <Button @click="reset" type="secondary">Reset</Button>
                    <Button @click="download" type="primary"
                        ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                        </svg>
                        Download
                    </Button>
                </div>
            </div>
        </div>
        <template v-else>
            <div
                class="p-4 rounded-md border border-neutral-800 bg-neutral-900/50 backdrop-blur-md w-full max-w-xl"
            >
                <div
                    @click="open"
                    ref="dropZoneRef"
                    class="flex flex-col items-center justify-center gap-6 p-16 border-2 border-dashed rounded-md"
                    :class="{
                        'border-blue-600': isOverDropZone,
                        'border-neutral-700': !isOverDropZone,
                        'border-red-600': isInvalid,
                    }"
                >
                    <UploadIcon />
                    <div class="flex flex-col items-center gap-2">
                        <Button type="primary" @click.stop="open"
                            >Upload</Button
                        >
                        <p class="text-neutral-500">
                            or drop an image in here...
                        </p>
                    </div>
                </div>
            </div>
            <Error v-if="isInvalid">File format is not supported!</Error>
        </template>
    </main>
    <LoadingOverlay v-if="isLoading" />
</template>

<style scoped>
#result-image {
    background-color: #000000;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23262626' fill-opacity='0.57'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>
