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
                edit === true ? "تعديل طلب" : "إضافة طلب جديد"
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
                  
                  <VSelectWithValidation
                    label="حالة الطلب"
                    rules="required"
                    :items="['Pending','Processing','Shipped','Delivered','Cancelled','Refund']"           
                    prepend-icon="lock"
                    v-model="admin.status"
                  />
                  
                  <VSelectWithValidation
                    label="شركات الشحن"
                    :rules="edit === true ? '' : 'required'"
                    :items="shipping_companies_ids" 
                    item-text="name"
                    item-value="id"          
                    prepend-icon="lock"
                    v-model="admin.shipping_companies_id"
                  />
                  
                  <VSelectWithValidation
                    label="حالة الدفع"
                    rules="required"
                    :items="['Pending','Paid','Refunded']"           
                    prepend-icon="lock"
                    v-model="admin.payment_status"
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

        <!-- Start View Description Dialog Form -->
        <v-dialog v-model="viewOrderDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span>معلومات الطلب</span>
              <v-spacer></v-spacer>

              <v-btn icon small @click="close">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text v-if="order_meta && order_meta.length > 0">
              <div v-for="order in order_meta">
                <hr/>
                <div v-if="order.product">
                  <div class="mt-3 mb-3">
                    <b>إسم المنتج: </b>
                    {{ order.product.name }}
                  </div>
                  <div class="mb-3">
                    <b>إسم المنتج بالعربي: </b>
                    {{ order.product.name_ar }}
                  </div>
                  <div class="mb-3">
                    <b>صورة المنتج: </b>
                    <span>
                      <a :href="`${imageBaseUrl}/${order.product.image}`" target="_blank">
                        <img
                          :src="`${imageBaseUrl}/${order.product.image}`" class="of-contain"
                          alt="صورة الفئة"
                        />
                      </a>
                    </span>
                  </div> 
                  <div class="mb-3" v-if="order.product.category">
                    <b>اسم الفئة التابع لها: </b>
                    {{ order.product.category.name_ar }}
                  </div>                  
                </div>
                <div class="mb-3" v-if="order.color_id">
                  <b>اللون المطلوب: </b>
                  <span>
                    {{ order.color.code }}
                    <span class="" :style="{'background': order.color['code']}" style="width: 16px; height: 16px; margin-inline: 5px; display: inline-block; border-radius: 4px;"></span>
                  </span>
                </div> 
                <div class="mb-3">
                  <b>العدد المطلوب: </b>
                  {{ order.qty }}
                </div>
                <div class="mb-3">
                  <b>نوع الطلب: </b>
                  {{ order.product_type == 'Piece' ? 'قطعة' : 'دستة' }}
                </div>
                <div class="mb-3">
                  <b>الاجمالي: </b>
                  {{ order.price_after_discount }}
                </div>  

              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="close" color="secondary">إغلاق</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- End Add/Edit Dialog Form -->

        <!-- Start Print Dialog Form -->
        <v-dialog v-model="printDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span></span>
              <v-spacer></v-spacer>
              <v-btn icon small @click="close">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text id="print_info" v-if="print_info">
              <div class="text-center">
                <div class="">
                  <b>رقم الطلب </b>
                  #{{ print_info.id }}
                </div>
                <div class="">
                  <b>العميل : </b>
                  {{ print_info.user_address.full_name }}
                </div>
                <div class="">
                  <b>رقم الهاتف : </b>
                  {{ print_info.user_address.phone }}
                </div>
                <div class="">
                  <b>العنوان : </b>
                  <span>
                    {{ print_info.user_address.governorate.name_ar }} - 
                    {{ print_info.user_address.city.name_ar }} - 
                    {{ print_info.user_address.area.name_ar }} 
                  </span>
                  <br>
                  <span>
                    {{ print_info.user_address.address_details }}
                  </span>
                </div>
                <div class="">
                  <b>الاجمالي : </b>
                  {{ print_info.total }}
                </div>
                <div class="">
                  <b>حالة الطلب : </b>
                  {{ print_info.payment_type == 1 ? 'الدفع عند الاستلام' : 'مدفوع'}}
                </div>
                <div class="pt-1">
                  <span class="px-2" style="border:1px solid black">
                    HoorBook - حور بوك
                  </span>                  
                </div> 
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="print" color="primary">طباعة</v-btn>
              <v-btn @click="close" color="secondary">إغلاق</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- End Add/Edit Dialog Form -->
      </v-toolbar>

      <!-- filter -->
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
                          label="رقم الطلب"
                          prepend-icon="lock"
                          v-model="filter.id"
                        />
                      </v-col>

                      <v-col class="pa-2" cols="12" lg="4" sm="6">
                        <VSelectWithValidation
                          label="حالة الطلب"
                          :items="['Pending','Processing','Shipped','Delivered','Cancelled','Refunded']"           
                          prepend-icon="lock"
                          v-model="filter.status"
                        />
                      </v-col>
                      
                      <v-col class="pa-2" cols="12" lg="4" sm="6">
                        <VSelectWithValidation
                          label="شركات الشحن"
                          :items="shipping_companies_ids" 
                          item-text="name"
                          item-value="id"          
                          prepend-icon="lock"
                          v-model="filter.shipping_companies_id"
                        />                        
                      </v-col>
                      
                      <v-col class="pa-2" cols="12" lg="4" sm="6">
                        <VSelectWithValidation
                          label="حالة الدفع"
                          :items="['Pending','Paid']"
                          prepend-icon="lock"
                          v-model="filter.payment_status"
                        />
                      </v-col>

                      <v-col class="pa-2" cols="12" lg="4" sm="6">
                        <VTextFieldWithValidation
                          label="تاريخ الطلب"
                          prepend-icon="lock"
                          v-model="filter.date"
                          type="date"
                        />
                      </v-col>


                      <v-col class="pa-2" cols="12" lg="4" sm="6">
                        <VSelectWithValidation
                          label="نوع العميل"
                          :items="user_type" 
                          item-text="type"
                          item-value="id"
                          prepend-icon="lock"
                          v-model="filter.user_type"
                        />
                      </v-col>
                     
                      <v-col class="pa-2" cols="12" lg="4" sm="6">
                        <VTextFieldWithValidation
                          label="ايميل العميل"
                          prepend-icon="lock"
                          v-model="filter.user_email"
                          type="text"
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
        
        <template v-slot:[`item.status`]="{ item }">
          <div v-if="item.status != null">
            <span>{{ item.status }}</span>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.shipping_company`]="{ item }">
          <div v-if="item.shipping_company != null">
            <div>{{ item.shipping_company.name }}</div>
            <div>{{ item.shipping_company.name_ar }}</div>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.order_meta`]="{ item }">
          <div v-if="item.order_meta != null">
            <v-btn
              color="blue"
              icon
              x-small
              @click="viewOrder(item)"
            >
              <span>{{ item.order_meta.length }}</span>
            </v-btn>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.total`]="{ item }">
          <div class="py-3">
            <div v-if="item.payment_type != null">
              <b>نوع الدفع: </b><span>{{ item.payment_type == 1 ? 'كاش' : 'Paymob'}}</span>
            </div>
            <div v-if="item.payment_status != null">
              <b>حالة الدفع: </b><span>{{ item.payment_status }}</span>
            </div>
            <div v-if="item.paymob_order_id != null">
              <b># طلب paymob: </b><span>{{ item.paymob_order_id }}</span>
            </div>
            <div v-if="item.discount_type != null">
              <b>نوع الخصم: </b><span>{{ item.discount_type }}</span>
            </div>

            <div v-if="item.sub_total != null">
              <b>المجموع الفرعي: </b><span>{{ item.sub_total }}</span>
            </div>
            <div v-if="item.discount != null">
              <b>قيمة الخصم: </b><span>{{ item.discount }}</span>
            </div>
            <div v-if="item.points_discount != null">
              <b> قيمة خصم النقاط: </b><span>{{ item.points_discount }}</span>
            </div>
            <div v-if="item.delivery_fee != null">
              <b>رسوم التوصيل: </b><span>{{ item.delivery_fee }}</span>
            </div>
            <div v-if="item.total != null">
              <b>الإجمالي: </b><span>{{ item.total }}</span>
            </div>
            <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
          </div>
        </template>

        <template v-slot:[`item.user_address`]="{ item }">
          <div class="py-3">
            <div v-if="item.user_address.id != null">
              <b>كود العنوان: </b><span>{{ item.user_address.id }}</span>
            </div>
            <div v-if="item.user_address.address_details != null">
              <b>تفاصيل العنوان: </b>
              <span>
                {{ item.user_address.governorate.name_ar }} - 
                {{ item.user_address.city.name_ar }} - 
                {{ item.user_address.area.name_ar }} - 
                {{ item.user_address.address_details }}
              </span>
            </div>
            <div v-if="item.user_address.longitude != null && item.user_address.latitude != null">
              <b>العنوان علي الخريطة: </b>
              <span>
                <a
                  :href="`https://www.google.com/maps?q=${item.user_address.latitude},${item.user_address.longitude}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  عرض على الخريطة
                </a>
              </span>
            </div>

            <div v-if="item.user_address.user_id != null">
              <b>كود العميل: </b><span>{{ item.user_address.user_id }}</span>
            </div>
            <div v-if="item.user_address.full_name != null">
              <b>إسم العميل: </b><span>{{ item.user_address.full_name }}</span>
            </div>
            <div v-if="item.user_address.phone != null">
              <b>رقم الهاتف: </b><span>{{ item.user_address.phone }}</span>
            </div>
            <div v-if="item.user_address.phone != null">
              <b>الإيميل: </b><span>{{ item.user.email }}</span>
            </div>
            <div v-if="item.user_address.verification_code != null">
              <b>كود التفعيل: </b><span>{{ item.user_address.verification_code }}</span>
            </div>
            <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
          </div>
        </template>

        <template v-slot:[`item.notes`]="{ item }">
          <div class="py-3">
            <div>
              <b>الملاحظات: </b>
              <div v-if="item.notes != null">{{ item.notes }}</div>
              <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
            </div>
            <div>
              <b>سبب الإلغاء: </b>
              <div v-if="item.Cancel_reason != null">{{ item.Cancel_reason }}</div>
              <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
            </div>
          </div>
        </template>

        <template v-slot:[`item.created_at`]="{ item }">
          <div v-if="item.created_at != null">
            <b>أنشئت في: </b>
            <div>
              {{ item.created_at | moment("dddd, MMMM Do YYYY hh:mm A") }}
            </div>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>

          <div v-if="item.updated_at != null">
            <b>تم التحديث في: </b>
            <div>
              {{ item.updated_at | moment("dddd, MMMM Do YYYY hh:mm A") }}
            </div>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <!-- start view order info action -->
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="blue"
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click="viewOrder(item)"
              >
                <v-icon>verified_user</v-icon>
              </v-btn>
            </template>
            <span>عرض معلومات الطلب</span>
          </v-tooltip>
          <!-- end view order info action -->

          <!-- start print action -->
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="black"
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click="viewPrintDialog(item)"
              >
                <v-icon>print</v-icon>
              </v-btn>
            </template>
            <span>طباعة</span>
          </v-tooltip>
          <!-- end print action -->

          <!-- start Edit action -->
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
          <!-- end Edit action -->
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
import VSelectWithValidation from "../components/inputs/VSelectWithValidation";
import VTextFieldWithValidation from "../components/inputs/VTextFieldWithValidation";
import { mapActions } from "vuex";
import { BASE_API, BASE_URL } from "../config/config";

export default {
  props: {
    title: {
      default: "الطلبات",
      type: String,
    },
    api: {
      default: "orders",
      type: String,
    },
  },
  data: () => ({
    admin: {
      status: "",
      shipping_companies_id: "",
      payment_status: "",
    },
    filter: {
      id: "",
      status: "",
      shipping_companies_id: null,
      payment_status: "",
      user_type: "",
      user_email:"",
      date: null,
    },
    panel: [ 0 ],
    isFiltering: false,
    connecting: false,
    errors: [],
    edit: false,
    dialog: false,
    requests: [],
    shipping_companies_ids: [],
    user_type:[
      {
        'type':"عادي",
        "id": 2
      },
      {
        'type':"جملة",
        "id": 3
      }  
    ],
    order_meta: [],
    print_info: null,
    viewOrderDialog: false,
    totalRequests: 0,
    pagination: {},
    loading: false,
    userFocus: null,
    headers: [
      { text: "#", value: "id", ...headerConst },
      { text: "حالة الطلب", value: "status", ...headerConst },
      { text: "معلومات الطلب", value: "order_meta", ...headerConst },
      { text: "شركة الشحن", value: "shipping_company", ...headerConst },
      { text: "معلومات الدفع", value: "total", ...headerConst },
      { text: "عنوان العميل", value: "user_address", ...headerConst },
      { text: "الملاحظات", value: "notes", ...headerConst },
      { text: "تواريخ", value: "created_at", ...headerConst },
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
    imageBaseUrl: BASE_URL.replace(/\/$/, ''),
  }),
  components: {
    VSelectWithValidation,
    VTextFieldWithValidation
  },
  computed: {
    formTitle() {
      return this.edit ? "Edit user" : "Add user";
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
    this.getShippingCampaniesId();
  },
  methods: {
    ...mapActions(["showNotification"]),
    fetch() {
      this.getDataFromApi().then((data) => {
        this.requests = JSON.parse(JSON.stringify(data.items));
        //console.log('getDataFromApi requests >>', data.items);
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
        if (res == null) {
          let endpoint = `${this.baseApi}/api/admin/orders?page=${this.page}`;

          this.$http.get(endpoint).then((res) => {
            this.isFiltering = false;
            let items = res.data.data;
            console.log('getDataFromApi items >>', items);
            let meta = res.data;
            this.loading = false;
            resolve({
              items,
              meta,
            });
          })
          .catch((error) => {
            if (error.message.includes('code 401')) {
              //console.log('auth error >>');
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
        let endpoint = `${this.baseApi}/api/admin/orders?page=${this.page}`;
        if (this.filter.id != '') endpoint += `&id=${this.filter.id}`;
        if (this.filter.status != '') endpoint += `&status=${this.filter.status}`;
        if (this.filter.shipping_companies_id != null) endpoint += `&shipping_companies_id=${this.filter.shipping_companies_id}`;
        if (this.filter.payment_status != '') endpoint += `&payment_status=${this.filter.payment_status}`;
        if (this.filter.user_type != '') endpoint += `&user_type=${this.filter.user_type}`;
        if (this.filter.user_email != null) endpoint += `&user_email=${this.filter.user_email}`;
        if (this.filter.date != null) endpoint += `&date=${this.filter.date}`;

        this.$http.get(endpoint).then((res) => {
          this.isFiltering = true;
          let items = res.data.data;
          let meta = res.data.meta;
          this.loading = false;
          resolve({
            items,
            meta,
          });
        })
        .catch((error) => {
          if (error.message.includes('code 401')) {
            //console.log('auth error >>');
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
        id:"",
        status: "",
        shipping_companies_id: null,
        payment_status: "",
        user_type: "",
        user_email:""
      };
    },
    getShippingCampaniesId(res = null) {
      this.loading = true;
      return new Promise(() => {
        if (res == null) {
          let endpoint = `${this.baseApi}/api/admin/shipping-companies?noPaginate=1`;

          this.$http.get(endpoint).then((res) => {
            let items = res.data.map((item) => {
              return {
                id: item.id,
                name: item.name_ar
              };
            });
            //console.log('getDataFromApi items >>', items);
            this.shipping_companies_ids = items;
          });
        }
      });
    },
    close() {
      this.errors = [];
      this.dialog = false;
      this.admin = {
        status: "",
        shipping_companies_id: "",
        payment_status: "",
      };
      this.order_meta = [];
      this.print_info = null;
      this.viewOrderDialog = false;
      this.printDialog = false;
    },
    viewPrintDialog(item) {
      this.printDialog = !this.printDialog;
      this.print_info = item;
      console.log('print_info >>', this.print_info);
    },
    print() {
      window.print();
    },
    editing(process, item = this.admin) {
      if (process === "add") {
        this.$nextTick(() => {
          this.$refs.obs.reset();
        });
        this.edit = false;
      }
      else {
        this.edit = true;
        this.$nextTick(() => {
          this.$refs.obs.validate();
        });
      }
      this.dialog = !this.dialog;
      this.admin.id = item.id;
      this.admin.status = item.status;
      this.admin.shipping_companies_id = item.shipping_companies_id;
      this.admin.payment_status = item.payment_status;
    },
    saveItem() {
      this.connecting = true;
      let formdata = new FormData();
      if (this.admin.status) formdata.append("status", this.admin.status);
      if (this.admin.shipping_companies_id) formdata.append("shipping_companies_id", this.admin.shipping_companies_id);
      if (this.admin.payment_status) formdata.append("payment_status", this.admin.payment_status);

      if (this.edit) {
        let endpoint = "";
        endpoint = `${this.baseApi}/api/admin/orders/${this.admin.id}`;
        this.$http
          .put(endpoint, {
            status: this.admin.status,
            shipping_companies_id: this.admin.shipping_companies_id,
            payment_status: this.admin.payment_status,
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
              this.alert.message = "Edit user done";
              this.close();
              this.errors = [];
              this.admin = {
                id: null,
                status: "",
                shipping_companies_id: "",
                payment_status: "",
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
      // const index = this.requests.indexOf(item);
      if (confirm("هل تود حذف هذا العنصر ؟")) {
        this.$http.delete(`${this.baseApi}/api/admin/orders/${item.id}`).then((res) => {
          this.showNotification("تمت العملية بنجاح");
          this.fetch();
          this.alert.message = "Delete user done";
          this.alert.type = "success";
        });
      }
    },
    viewOrder(item) {
      this.viewOrderDialog = !this.viewOrderDialog;
      this.order_meta = item.order_meta;
    },
  },
};
</script>

<style scoped lang="scss">
.of-cover {
  object-fit: cover;
  -o-object-fit: cover;
  width: 100%;
  height: 48px;
  margin-top: 8px;
}
.of-contain {
  object-fit: contain;
  -o-object-fit: contain;
  width: 48px;
  height: 48px;
  margin-top: 8px;
}
</style>
