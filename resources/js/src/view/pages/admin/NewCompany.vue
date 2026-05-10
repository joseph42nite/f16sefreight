<template>
    <div class="mt-10 p-5">
        <b-form @submit="onSubmit" class="w-md-50 fw-700">
            <h3 class="fw-700">{{ action }} company</h3>
            <div class="bg-white p-10 rounded">
                <div class="d-flex mb-7">
                    <b-form-group class="w-50 mr-2">
                        <b-form-input
                            id="input-1"
                            v-model="company_form.name"
                            type="text"
                            required
                            placeholder="Name"
                            class="mx-1 input-box"
                            :class="{'is-invalid': company_form.errors.has('name'),}"
                        ></b-form-input>
                        <has-error :form="company_form" field="name"></has-error>
                    </b-form-group>
                </div>
                <div class="alert alert-success mt-3" role="alert" id="fade">
                    <span class="font-weight-bolder font-size-h6">Saved Successfully</span>
                </div>
                <button class="btn font-weight-bolder font-size-h6 py-3 w-100 create_btn text-white mt-3">
                    {{ action }} company
                </button>
            </div>
        </b-form>
    </div>
</template>
<script>
import ApiService from "@/core/services/api.service";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
    data() {
        return {
            company_form: new Form({
                id: "",
                name: "",
            }),
            action: "Add",
            location: [],
            searchQuery: "",
            isDropdownOpen: false,
            showpass: true,
        };
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            if (this.action == "Add") {
                this.company_form
                    .post(`/superadmin/create-company`)
                    .then(({ data }) => {
                        this.$router.push("/superadmin/all-company");
                    })
                    .catch((err) => {
                    });
            } else {
                this.company_form
                    .put(`/superadmin/edit-company/${this.company_form.id}`)
                    .then(({ data }) => {
                        $("#fade").fadeToggle(1000);
                        $("#fade").fadeToggle(1000);
                    });
            }
        },
        getData(id) {
            ApiService.get(`/superadmin/all-company/${id}`).then(({ data }) => {
                this.company_form.fill(data[0]);
            });
        },
    },
    mounted() {
        // console.log(this.get_item)
        if (this.get_item) {
            this.getData(this.get_item);
            this.action = "Edit";
        }
    },
    computed: {
        get_item: function () {
            if (this.$route.params.id) return this.$route.params.id;
            else return 0;
        },
    },
};
</script>
<style scoped>
.fw-700 {
    font-weight: 700;
}
.input-box {
    border: 1px silver solid;
}
.create_btn {
    background: #00a1e4;
}
#fade {
    display: none;
}

.custom-dropdown {
    position: relative;
    display: inline-block;
    width: 100%;
    border: solid 1px silver;
    border-radius: 5px;
}

.form-control {
    width: 100%;
}

.dropdown-options {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #fff;
    border: 1px solid #ccc;
    border-top: none;
    max-height: 200px; /* Adjust as needed */
    overflow-y: auto;
}

.option {
    padding: 5px 10px;
    cursor: pointer;
}

.option:hover {
    background-color: #f0f0f0;
}
</style>
