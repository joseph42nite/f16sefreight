<template>
    <div class="py-5 px-2">
        <div class="d-flex align-items-center justify-content-between mb-6">
            <div>
                <router-link to="/superadmin/all-blogs" class="text-muted font-weight-bold mb-2 d-inline-block"><i class="fas fa-arrow-left mr-2"></i> Back to All Blogs</router-link>
                <h2 class="font-weight-bolder text-dark">{{ actionLabel }} Editorial Post</h2>
            </div>
            <b-button variant="primary" @click="submitPost" class="px-8 font-weight-bolder" :disabled="submitting">
                <b-spinner small v-if="submitting" class="mr-2"></b-spinner>
                {{ actionLabel }} Blog
            </b-button>
        </div>

        <div class="row">
            <div class="col-lg-8">
                <!-- MAIN CONTENT -->
                <div class="admin-glass-card mb-6">
                    <h4 class="font-weight-bold mb-5 text-primary"><i class="fas fa-edit mr-2 text-primary"></i> Core Content</h4>
                    
                    <b-form-group label="Blog Title" label-class="font-weight-bold text-muted small text-uppercase">
                        <b-form-input v-model="blogData.title" placeholder="e.g., The Future of Air Logistics" class="form-control-lg font-weight-bolder py-5 border-2" required></b-form-input>
                    </b-form-group>

                    <div class="row">
                        <div class="col-md-6">
                            <b-form-group label="Category" label-class="font-weight-bold text-muted small text-uppercase">
                                <b-form-select v-model="blogData.category" :options="categories" class="border-2"></b-form-select>
                            </b-form-group>
                        </div>
                        <div class="col-md-6">
                            <b-form-group label="Reading Duration" label-class="font-weight-bold text-muted small text-uppercase">
                                <b-form-input v-model="blogData.read_time" placeholder="e.g., 8 min" class="border-2"></b-form-input>
                            </b-form-group>
                        </div>
                    </div>

                    <b-form-group label="Excerpt (Short Summary)" label-class="font-weight-bold text-muted small text-uppercase" description="Displayed on the public feed cards.">
                        <b-form-textarea v-model="blogData.excerpt" rows="3" class="border-2" placeholder="Brief hook for readers..."></b-form-textarea>
                    </b-form-group>

                    <b-form-group label="Article Content" label-class="font-weight-bold text-muted small text-uppercase" class="mt-6">
                        <quill-editor v-model="blogData.content" ref="myQuillEditor" :options="editorOption" class="bg-white quill-modern shadow-sm" style="min-height: 350px; border-radius: 8px;"></quill-editor>
                        
                        <div class="d-flex align-items-start mt-3 bg-light rounded p-3 border">
                            <i class="fas fa-link text-primary mr-3 mt-1"></i>
                            <div>
                                <small class="text-dark font-weight-bold d-block mb-1">Quick Internal Link Reference:</small>
                                <div class="d-flex flex-wrap gap-2">
                                    <b-badge variant="secondary" class="mr-2 p-2 cursor-pointer" v-b-tooltip.hover title="Click to copy" @click="copyLink('/services')">/services</b-badge>
                                    <b-badge variant="secondary" class="mr-2 p-2 cursor-pointer" v-b-tooltip.hover title="Click to copy" @click="copyLink('/solutions')">/solutions</b-badge>
                                    <b-badge variant="secondary" class="mr-2 p-2 cursor-pointer" v-b-tooltip.hover title="Click to copy" @click="copyLink('/product-description')">/product-description</b-badge>
                                    <b-badge variant="secondary" class="mr-2 p-2 cursor-pointer" v-b-tooltip.hover title="Click to copy" @click="copyLink('/about-us')">/about-us</b-badge>
                                    <b-badge variant="secondary" class="p-2 cursor-pointer" v-b-tooltip.hover title="Click to copy" @click="copyLink('/contact-us')">/contact-us</b-badge>
                                </div>
                                <small class="text-muted mt-2 d-block">Highlight your text, click the link icon <i class="fas fa-link text-dark mx-1"></i> in the toolbar above, and paste one of these paths.</small>
                            </div>
                        </div>
                    </b-form-group>
                </div>

                <!-- KEY TAKEAWAYS -->
                <div class="admin-glass-card">
                    <h4 class="font-weight-bold mb-5"><i class="fas fa-list-check mr-2"></i> Key Takeaways</h4>
                    <div v-for="(takeaway, index) in blogData.takeaways" :key="index" class="d-flex mb-3">
                        <b-input-group>
                            <template #prepend>
                                <b-input-group-text class="bg-light font-weight-bold">{{ index + 1 }}</b-input-group-text>
                            </template>
                            <b-form-input v-model="blogData.takeaways[index]" placeholder="Enter key insight..."></b-form-input>
                            <template #append>
                                <b-button variant="light-danger" @click="removeTakeaway(index)"><i class="fas fa-times"></i></b-button>
                            </template>
                        </b-input-group>
                    </div>
                    <b-button variant="light-primary" size="sm" @click="addTakeaway" class="font-weight-bold"><i class="fas fa-plus mr-1"></i> Add Point</b-button>
                </div>
            </div>

            <div class="col-lg-4">
                <!-- ASSET SIDEBAR -->
                <div class="admin-glass-card mb-6 border border-dashed border-primary bg-light-primary">
                    <h4 class="font-weight-bold mb-4"><i class="fas fa-image mr-2"></i> Cover Image</h4>
                    
                    <div class="alert alert-info py-3 font-size-xs border-0" style="background: rgba(53, 85, 148, 0.08); color: #1e3a6e;">
                        <i class="fas fa-info-circle mr-1"></i> <strong>Optimization Rule:</strong>
                        <ul class="pl-4 mt-1 mb-0">
                            <li>Must be in <strong>.webp</strong> format</li>
                            <li>Recommended: <strong>1200 x 800px</strong> (aspect 3:2)</li>
                        </ul>
                    </div>

                    <div class="thumbnail-preview mb-4 border rounded bg-white d-flex align-items-center justify-content-center overflow-hidden shadow-sm" style="height: 200px;">
                        <img v-if="previewImage" :src="previewImage" class="w-100 h-100 object-fit-cover" />
                        <div v-else class="text-muted text-center p-4">
                            <i class="far fa-image fa-3x mb-2 text-light-dark"></i>
                            <p class="mb-0 small">No thumbnail uploaded</p>
                        </div>
                    </div>

                    <b-form-file
                        v-model="selectedFile"
                        :state="Boolean(selectedFile)"
                        accept=".webp,.png,.jpg,.jpeg"
                        placeholder="Choose WebP image..."
                        drop-placeholder="Drop file here..."
                        @change="onFileChange"
                        browse-text="Select"
                    ></b-form-file>
                </div>

                <!-- SEO WRAPPER -->
                <div class="admin-glass-card">
                    <h4 class="font-weight-bold mb-4"><i class="fas fa-search mr-2"></i> SEO Settings</h4>
                    
                    <b-form-group label="Meta Title (Page Title)" label-class="small font-weight-bold">
                        <b-form-input v-model="blogData.meta_title" placeholder="Auto-fills with blog title if empty" class="font-size-sm"></b-form-input>
                    </b-form-group>

                    <b-form-group label="Meta Description" label-class="small font-weight-bold" description="Used by Google search rankings.">
                        <b-form-textarea v-model="blogData.meta_description" rows="4" class="font-size-sm" placeholder="Write unique summary to attract clicks..."></b-form-textarea>
                    </b-form-group>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.snow.css';
import Swal from 'sweetalert2';

export default {
    name: "NewBlog",
    components: {
        quillEditor
    },
    data() {
        return {
            submitting: false,
            selectedFile: null,
            previewImage: null,
            blogData: {
                title: "",
                category: "Air Freight",
                read_time: "8 min",
                excerpt: "",
                content: "",
                takeaways: ["", "", ""],
                meta_title: "",
                meta_description: "",
            },
            categories: [
                "Air Freight", "Sea Freight", "Industry News", "Technology", "ERP Solutions", "Company Updates"
            ],
            editorOption: {
                theme: 'snow',
                placeholder: 'Write your insightful content here...',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'header': [2, 3, 4, false] }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'blockquote', 'code-block'],
                        [{ 'color': [] }, { 'background': [] }],
                        ['clean']
                    ]
                }
            }
        };
    },
    computed: {
        blogId() {
            return this.$route.params.id || null;
        },
        actionLabel() {
            return this.blogId ? "Update" : "Publish";
        }
    },
    mounted() {
        if (this.blogId) {
            this.fetchBlogDetails();
        }
    },
    methods: {
        addTakeaway() {
            this.blogData.takeaways.push("");
        },
        copyLink(path) {
            navigator.clipboard.writeText(path);
            this.$bvToast.toast(`Copied "${path}" to clipboard!`, {
                title: 'Copied',
                variant: 'info',
                solid: true,
                autoHideDelay: 1500
            });
        },
        removeTakeaway(index) {
            this.blogData.takeaways.splice(index, 1);
        },
        onFileChange(e) {
            const file = e.target.files[0];
            if (file) {
                this.previewImage = URL.createObjectURL(file);
            }
        },
        fetchBlogDetails() {
            // Backend fetch based on standard internal GET but for specific record
            // Just use our internal endpoint that queries all and filter locally OR fetch by ID.
            // Let's use current system logic if they fetch specific ones.
            ApiService.get(`/superadmin/all-blogs-internal`)
                .then(({data}) => {
                    const target = data.data.find(b => b.id == this.blogId);
                    if (target) {
                        this.blogData = { ...target };
                        this.previewImage = target.image_path;
                        // Handle array casting validation
                        if (typeof target.takeaways === 'string') {
                            this.blogData.takeaways = JSON.parse(target.takeaways);
                        }
                        if (!Array.isArray(this.blogData.takeaways)) {
                            this.blogData.takeaways = [""];
                        }
                    }
                });
        },
        submitPost() {
            if (!this.blogData.title || !this.blogData.content) {
                Swal.fire('Hold up', 'Title and Content are mandatory fields.', 'warning');
                return;
            }
            
            this.submitting = true;
            
            // Use raw FormData to pack images
            const fd = new FormData();
            fd.append('title', this.blogData.title);
            fd.append('category', this.blogData.category);
            fd.append('read_time', this.blogData.read_time);
            fd.append('excerpt', this.blogData.excerpt);
            fd.append('content', this.blogData.content);
            fd.append('meta_title', this.blogData.meta_title || '');
            fd.append('meta_description', this.blogData.meta_description || '');
            
            // Format takeaways to drop empties and append each element correctly
            const filteredTakeaways = this.blogData.takeaways.filter(t => t.trim().length > 0);
            filteredTakeaways.forEach((t, index) => {
                fd.append(`takeaways[${index}]`, t);
            });

            if (this.selectedFile) {
                fd.append('image', this.selectedFile);
            }

            let url = '/superadmin/create-blog';
            // Laravel PUT trick for multipart data: Laravel doesn't parse native PUT multipart automatically 
            // reliably sometimes, sending POST with _method is widely supported standard.
            if (this.blogId) {
                url = `/superadmin/edit-blog/${this.blogId}`;
                fd.append('_method', 'PUT');
            }

            ApiService.post(url, fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(({ data }) => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Your editorial changes have been saved.',
                    icon: 'success',
                    timer: 2000
                });
                this.$router.push('/superadmin/all-blogs');
            })
            .catch(err => {
                const msg = err.response?.data?.message || 'An error occurred while saving the blog post.';
                Swal.fire('Error', msg, 'error');
            })
            .finally(() => {
                this.submitting = false;
            });
        }
    }
};
</script>

<style>
/* Modern custom styling for Quill integration to look like high-end editorial suite */
.quill-modern .ql-toolbar.ql-snow {
    border: none;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 12px;
}
.quill-modern .ql-container.ql-snow {
    border: none;
    font-size: 1.1rem;
    font-family: 'Inter', sans-serif;
    min-height: 300px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}
.ql-editor {
    line-height: 1.7;
}
.ql-editor h2, .ql-editor h3 {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
    color: #1e3a6e;
}
.object-fit-cover {
    object-fit: cover;
}
.cursor-pointer {
    cursor: pointer;
    transition: transform 0.2s;
}
.cursor-pointer:hover {
    transform: scale(1.05);
    opacity: 0.9;
}
</style>
