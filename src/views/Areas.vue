/* eslint-disable */
<template>
  <v-flex xs12>
    <div class="elevation-2">
      <v-toolbar flat color="white">
        <v-toolbar-title style="margin-left:10px">{{ title }}</v-toolbar-title>

        <!-- Start Add/Edit Dialog Form -->
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span>{{
                edit === true ? "تعديل منطقة" : "إضافة منطقة جديد"
              }}</span>
              <v-spacer></v-spacer>
              <v-btn icon small @click="close">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <ValidationObserver
              ref="obs"
              v-slot="{ invalid, validated, handleSubmit }"
            >
              <form
                ref="changePasswordForm"
                @submit.prevent="handleSubmit(saveItem)"
              >
                <v-card-text class="text-xs-center">
                  <ul style="list-style: none">
                    <li
                      class="red--text"
                      v-for="error in errors"
                      :key="error[0] + Math.random()"
                    >
                      <ul style="list-style: none">
                        <li v-for="err in error" :key="err + Math.random()">
                          <small>{{ err }}</small>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </v-card-text>

                <v-card-text>
                  <VTextFieldWithValidation
                    rules="required|min:3"
                    label="الإسم"
                    v-model="admin.name"
                    prepend-icon="lock"
                    type="text"
                  />

                  <VTextFieldWithValidation
                    rules="required|min:3"
                    v-model="admin.name_ar"
                    label="الإسم بالعربي"
                    prepend-icon="mail"
                  />

                  <VSelectWithValidation
                    label="المدينة"
                    rules="required"
                    :items="cities_ids"
                    item-text="name"
                    item-value="id"
                    prepend-icon="lock"
                    v-model="admin.city_id"
                  />

                  <VTextFieldWithValidation
                    rules="required|regex:^[0-9.]*$"
                    v-model="admin.cost"
                    label="التكلفة"
                    prepend-icon="money"
                    type="text"
                  />

                  <VTextFieldWithValidation
                    rules="regex:^[0-9.]*$"
                    v-model="admin.minimum_delivery_free_cost"
                    label="الحد الأدنى للتوصيل المجاني"
                    prepend-icon="local_shipping"
                    type="text"
                  />
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    type="submit"
                    :disabled="invalid || !validated || connecting"
                    :loading="connecting"
                    color="primary"
                    >حفظ</v-btn
                  >
                  <v-btn @click="close" color="secondary">إغلاق</v-btn>
                </v-card-actions>
              </form>
            </ValidationObserver>
          </v-card>
        </v-dialog>
        <!-- End Add/Edit Dialog Form -->

        <v-spacer></v-spacer>

        <!-- start Add action -->
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              fab
              small
              v-bind="attrs"
              v-on="on"
              @click="editing('add')"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </template>
          <span>اضافة عنصر جديد</span>
        </v-tooltip>
        <!-- end Add action -->
      </v-toolbar>

      <!-- Filter -->
      <div class="pa-3">
        <v-expansion-panels v-model="panel" multiple>
          <v-expansion-panel>
            <v-expansion-panel-header>
              فلتر
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ValidationObserver
                ref="obs"
                v-slot="{ handleSubmit }">
                <form
                  ref="filterForm"
                  @submit.prevent="handleSubmit(fetchFilter)">
                  <v-card-text>
                    <v-row
                      align="center"
                      no-gutters
                    >
                      <v-col class="pa-2" cols="12" lg="4" sm="6">
                        <VTextFieldWithValidation
                          label="الإسم"
                          v-model="filter.name"
                          prepend-icon="lock"
                          type="text"
                        />
                      </v-col>
                        <v-col class="pa-2" cols="12" lg="4" sm="6">
                        <VSelectWithValidation
                          label="المدينة"
                          :items="cities_ids"
                          item-text="name"
                          item-value="id"
                          prepend-icon="lock"
                          v-model="filter.city_id"
                        />

                      </v-col>
                    </v-row>      
                  </v-card-text>

                  <v-card-actions>
                    <v-btn
                      type="submit"
                      color="primary">
                      فلتر
                    </v-btn>
                    
                    <v-btn
                      @click="clearFilter"
                      color="secondary">
                      مسح الفلتر
                    </v-btn>
                  </v-card-actions>
                </form>
              </ValidationObserver>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

      </div>

      <v-data-table
        loading-text="انتظر قليلا..."
        :headers="headers"
        :items="requests"
        :page.sync="page"
        :server-items-length="totalRequests"
        :loading="loading"
        hide-default-footer
        item-key="id"
        :options.sync="pagination"
      >
      
        <template v-slot:[`item.id`]="{ item }">
          <span v-if="item.id != null">{{ item.id }}</span>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>
        
        <template v-slot:[`item.name`]="{ item }">
          <div v-if="item.name != null">
            <span>{{ item.name }}</span>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.name_ar`]="{ item }">
          <div v-if="item.name_ar != null">
            <span>{{ item.name_ar }}</span>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>
      
        <template v-slot:[`item.city`]="{ item }">
          <div v-if="item.city != null">
            <div>{{ item.city.name }}</div>
            <div>{{ item.city.name_ar }}</div>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.cost`]="{ item }">
          <div v-if="item.cost != null">
            <span>{{ item.cost }}</span>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.minimum_delivery_free_cost`]="{ item }">
          <div v-if="item.minimum_delivery_free_cost != null">
            <span>{{ item.minimum_delivery_free_cost }}</span>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.created_at`]="{ item }">
          <span v-if="item.created_at != null">{{ item.created_at | moment("dddd, MMMM Do YYYY") }}</span>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.updated_at`]="{ item }">
          <span v-if="item.updated_at != null">{{ item.updated_at | moment("dddd, MMMM Do YYYY") }}</span>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <!-- start Add-Edit action -->
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="orange"
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click="editing('edit', item)"
              >
                <v-icon>edit</v-icon>
              </v-btn>
            </template>
            <span>تعديل</span>
          </v-tooltip>
          <!-- end Add-Edit action -->

          <!-- start delete action -->
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="red"
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click="deleteItem(item)"
              >
                <v-icon>delete_forever</v-icon>
              </v-btn>
            </template>
            <span>حذف</span>
          </v-tooltip>
          <!-- end delete action -->
        </template>
        
        <template slot="pageText" slot-scope="props">
          Pages {{ props.pageStart }} - {{ props.pageStop }} من
          {{ props.itemsLength }}
        </template>

        <template slot="no-data" class="text-xs-center">
          <v-alert :value="true" color="error" class="text-xs-center" outlined>
            <v-icon class="red--text">
              warning
            </v-icon>
            لا يوجد عناصر
          </v-alert>
        </template>
      </v-data-table>

      <div class="text-xs-center pt-2">
        <v-pagination
          total-visible="6"
          color="primary"
          v-model="page"
          :length="pages"
        ></v-pagination>
      </div>
    </div>
  </v-flex>
</template>

<script>
const headerConst = { align: "center", sortable: false };
import VTextFieldWithValidation from "../components/inputs/VTextFieldWithValidation";
import VSelectWithValidation from "../components/inputs/VSelectWithValidation";
import { mapActions } from "vuex";
import { BASE_API } from "../config/config";

export default {
  props: {
    title: {
      default: "المناطق",
      type: String,
    },
    api: {
      default: "areas",
      type: String,
    },
  },
  data: () => ({
    admin: {
      name: "",
      name_ar: "",
      cost: null,
      minimum_delivery_free_cost: 0,
      city_id: null,
    },
    filter: {
      name: "",
      city_id:""
    },
    panel: [ 0 ],
    isFiltering: false,
    connecting: false,
    errors: [],
    edit: false,
    dialog: false,
    requests: [],
    cities_ids: [],
    totalRequests: 0,
    pagination: {},
    loading: false,
    
    headers: [
      { text: "#", value: "id", ...headerConst },
      { text: "الاسم", value: "name", ...headerConst },
      { text: "الاسم بالعربية", value: "name_ar", ...headerConst },
      { text: "المدينة", value: "city", ...headerConst },
      { text: "التكلفة", value: "cost", ...headerConst },
      { text: "الحد الأدنى للتوصيل المجاني", value: "minimum_delivery_free_cost", ...headerConst },
      { text: "أنشئت في", value: "created_at", ...headerConst },
      { text: "تم التحديث في", value: "updated_at", ...headerConst },
      { text: "عمليات", value: "actions", ...headerConst },
    ],
    editedItem: null,
    alert: {
      message: "",
      type: "success",
    },
    page: 1,
    pages: 0,
    index: null,
    baseUrl: window.location.origin,
    baseApi: BASE_API,
  }),
  components: {
    VTextFieldWithValidation,
    VSelectWithValidation
  },
  computed: {
    formTitle() {
      return this.edit ? "Edit area" : "Add area";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    page(val) {
      this.pagination.page = val;
      if (this.isFiltering) {
        this.fetchFilter();
      }
      else {
        this.fetch();
      }
    },
  },
  created() {
    if (this.loading) return;
    this.fetch();
    this.getCitiesIds();
  },
  methods: {
    ...mapActions(["showNotification"]),
    fetch() {
      this.getDataFromApi().then((data) => {
        this.requests = JSON.parse(JSON.stringify(data.items));
        console.log('getDataFromApi requests >>', data.items);
        let meta = data.meta;
        this.totalRequests = meta.total;
        this.pagination.rowsPerPage = meta.per_page;
        this.pagination.totalItems = meta.total;
        this.pages = Math.ceil(
          this.pagination.totalItems / this.pagination.rowsPerPage
        );
      });
      if (this.loading) return;
    },
    getDataFromApi(res = null) {
      this.loading = true;
      return new Promise((resolve) => {
        if (res != null) {
          this.isFiltering = false;
          let items = res.data.data;
          const total = res.data.total;
          this.pagination.rowsPerPage = res.data.per_page;
          this.pagination.totalItems = res.data.total;
          this.pages = Math.ceil(
            this.pagination.totalItems / this.pagination.rowsPerPage
          );
          this.loading = false;
          resolve({
            items,
            total,
          });
        }
        else {
          let endpoint = `${this.baseApi}/api/admin/areas?page=${this.page}`;

          this.$http.get(endpoint).then((res) => {
            let items = res.data.data;
            let meta = res.data;
            this.loading = false;
            resolve({
              items,
              meta,
            });
          })
          .catch((error) => {
            if (error.message.includes('code 401')) {
              console.log('auth error >>');
              this.$router.push({ path: '/auth/login' })
            }
          });
        }
      });
    },
    fetchFilter() {
      this.filterDataFromApi().then((data) => {
        this.requests = JSON.parse(JSON.stringify(data.items));
        //console.log('requests >>', data.items);
        let meta = data.meta;
        this.totalRequests = meta.total;
        this.pagination.rowsPerPage = meta.per_page;
        this.pagination.totalItems = meta.total;
        this.pages = Math.ceil(
          this.pagination.totalItems / this.pagination.rowsPerPage
        );
      });
      if (this.loading) return;
    },
    filterDataFromApi() {
      this.loading = true;
      return new Promise((resolve) => {
        let endpoint = `${this.baseApi}/api/admin/areas?page=${this.page}`;
        if (this.filter.name != '') endpoint += `&name=${this.filter.name}`;
        if (this.filter.city_id != '') endpoint += `&city_id=${this.filter.city_id}`;

        
        this.$http.get(endpoint).then((res) => {
          this.isFiltering = true;
          let items = res.data.data;
          let meta = res.data;
          this.loading = false;
          resolve({
            items,
            meta,
          });
        })
        .catch((error) => {
          if (error.message.includes('code 401')) {
            console.log('auth error >>');
            this.$router.push({ path: '/auth/login' })
          }
        });
      });
    },
    clearFilter() {
      this.page = 1;
      this.fetch();
      this.isFiltering = false;
      this.filter = {
        name: "",
      };
    },
    getCitiesIds(res = null) {
      this.loading = true;
      return new Promise(() => {
        if (res == null) {
          let endpoint = `${this.baseApi}/api/admin/cities?noPaginate=1`;

          this.$http.get(endpoint).then((res) => {
            let items = res.data.map((item) => {
              return {
                id: item.id,
                name: item.name_ar
              };
            });
            this.cities_ids = items;
          });
        }
      });
    },
    close() {
      this.errors = [];
      this.dialog = false;
      this.admin = {
        name: "",
        name_ar: "",
        cost: null,
        minimum_delivery_free_cost: 0,
        city_id: null,
      };
    },
    editing(process, item = this.admin) {
      if (process === "add") {
        this.$nextTick(() => {
          this.$refs.obs.reset();
        });
        this.edit = false;
      } else {
        this.edit = true;
        this.$nextTick(() => {
          this.$refs.obs.validate();
        });
      }
      this.dialog = !this.dialog;
      this.admin.id = item.id;
      this.admin.name = item.name;
      this.admin.name_ar = item.name_ar;
      this.admin.city_id = item.city_id;
      this.admin.cost = item.cost;
      this.admin.minimum_delivery_free_cost = item.minimum_delivery_free_cost != null ? item.minimum_delivery_free_cost : 0;
    },
    saveItem() {
      this.connecting = true;
      let formdata = new FormData();
      if (this.admin.name) formdata.append("name", this.admin.name);
      if (this.admin.name_ar) formdata.append("name_ar", this.admin.name_ar);
      if (this.admin.cost) formdata.append("cost", Number(this.admin.cost));
      formdata.append("minimum_delivery_free_cost", this.admin.minimum_delivery_free_cost != null ? Number(this.admin.minimum_delivery_free_cost) : 0);
      if (this.admin.city_id) formdata.append("city_id", this.admin.city_id);

      if (this.edit) {
        let endpoint = `${this.baseApi}/api/admin/areas/${this.admin.id}`;
        this.$http
          .put(endpoint, {
            name: this.admin.name,
            name_ar: this.admin.name_ar,
            cost: Number(this.admin.cost),
            minimum_delivery_free_cost: this.admin.minimum_delivery_free_cost != null ? Number(this.admin.minimum_delivery_free_cost) : 0,
            city_id: this.admin.city_id,
          })
          .then((res) => {
            if (res.data && res.data.status && !res.data.status.status) {
              this.showNotification(res.data.status.validation_message);
              this.connecting = false;
            }
            else {
              this.showNotification("تمت العملية بنجاح");
              if (this.isFiltering) {
                this.fetchFilter();
              }
              else {
                this.fetch();
              }
              this.alert.type = "warning";
              this.alert.message = "Edit area done";
              this.close();
              this.errors = [];
              this.admin = {
                id: null,
                name: "",
                name_ar: "",
                cost: null,
                minimum_delivery_free_cost: 0,
                city_id: "",
              };
              this.connecting = false;
            }
          })
          .catch(({ response }) => {
            this.errors = response.data.errors;
            this.connecting = false;
          });
      } else {
        this.$http
          .post(`${this.baseApi}/api/admin/areas`, formdata)
          .then((res) => {
            if (res.data && res.data.status && !res.data.status.status) {
              this.showNotification(res.data.status.validation_message);
              this.connecting = false;
            }
            else {
              this.showNotification("تمت العملية بنجاح");
              this.fetch();
              this.alert.type = "info";
              this.alert.message = "Add area done!";
              this.close();
              this.errors = [];
              this.admin = {
                id: null,
                name: "",
                name_ar: "",
                cost: null,
                minimum_delivery_free_cost: 0,
                city_id: "",
              };
              this.connecting = false;
            }
          })
          .catch(({ response }) => {
            this.errors = response.data.errors;
            this.connecting = false;
          });
      }
    },
    deleteItem(item) {
      if (confirm("هل تود حذف هذا العنصر ؟")) {
        this.$http.delete(`${this.baseApi}/api/admin/areas/${item.id}`).then((res) => {
          this.showNotification("تمت العملية بنجاح");
          this.fetch();
          this.alert.message = "Delete area done";
          this.alert.type = "success";
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > td,
.v-data-table > .v-data-table__wrapper > table > thead > tr > td {
  height: 80px !important;
}
</style>
