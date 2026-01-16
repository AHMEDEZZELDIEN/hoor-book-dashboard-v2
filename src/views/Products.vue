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
                edit === true ? "تعديل منتج" : "إضافة منتج جديد"
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
                <!-- Show Error -->
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
                    label="الإسم بالعربي"
                    v-model="admin.name_ar"
                    prepend-icon="lock"
                    type="text"
                  />

                  <VTextFieldWithValidation
                    rules="required|min:3"
                    label="الإسم للبحث"
                    v-model="admin.searching_name"
                    prepend-icon="lock"
                    type="text"
                  />

                  <VTextFieldWithValidation
                    rules="required|min:3"
                    label="الإسم بالعربي للبحث"
                    v-model="admin.searching_name_ar"
                    prepend-icon="lock"
                    type="text"
                  />

                  <VTextAreaWithValidation
                    rules="required"
                    v-model="admin.desc"
                    label="الوصف"
                    rows="2"
                    prepend-icon="lock"
                  />
                  
                  <VTextFieldWithValidation
                    rules="required|regex:^[0-9]*$"
                    label="المخزون"
                    v-model="admin.stock"
                    prepend-icon="lock"
                    hide-spin-buttons
                    type="text"
                  />

                  <VTextFieldWithValidation
                    rules="regex:^[0-9.]*$"
                    label="سعر الجملة للقطعة"
                    v-model="admin.piece_wholesale_price"
                    prepend-icon="lock"
                    type="text"
                  />

                  <VTextFieldWithValidation
                    rules="regex:^[0-9.]*$"
                    label="سعر الجملة للدستة"
                    v-model="admin.packet_wholesale_price"
                    prepend-icon="lock"
                    type="text"
                  />

                  <VTextFieldWithValidation
                    rules="required|regex:^[0-9.]*$"
                    label="سعر القطعة للمستخدم"
                    v-model="admin.user_price_of_piece"
                    prepend-icon="lock"
                    type="text"
                  />

                  <VTextFieldWithValidation
                    rules="required|regex:^[0-9.]*$"
                    label="سعر القطعة للمكتبة"
                    v-model="admin.library_price_of_piece"
                    prepend-icon="lock"
                    type="text"
                  />

                  <VTextFieldWithValidation
                    rules="required|regex:^[0-9]*$"
                    label="عدد القطع داخل الدستة"
                    v-model="admin.packet_pieces"
                    prepend-icon="lock"
                    type="text"
                  />

                  <VTextFieldWithValidation
                    rules="required|regex:^[0-9.]*$"
                    label="سعر الرزمة للمستخدم"
                    v-model="admin.user_price_of_packet"
                    prepend-icon="lock"
                    type="text"
                  />

                  <VTextFieldWithValidation
                    rules="required|regex:^[0-9.]*$"
                    label="سعر الرزمة للمكتبة"
                    v-model="admin.library_price_of_packet"
                    prepend-icon="lock"
                    type="text"
                  />

                  <VTextFieldWithValidation
                    label="كود المنتج"
                    v-model="admin.serial_number"
                    prepend-icon="lock"
                    type="text"
                  />
                  
                  
                  <VFileInputWithValidation
                    :rules="edit === true ? '' : 'required'"
                    label="الصورة"
                    variant="filled"
                    prepend-icon="camera"
                    v-model="admin.image"
                  />
                  <div class="text-center">
                    <span v-if="admin.view_image === null || admin.view_image === ''">لا يوجد صورة</span>
                    <div v-else-if="typeof admin.view_image === 'object'"></div>

                    <a v-else :href="`${imageBaseUrl}/${admin.view_image}`" target="_blank">
                      <img class="of-contain"
                        :src="`${imageBaseUrl}/${admin.view_image}`"
                        alt="صورة المنتج"
                      />
                    </a>
                  </div>

                  <VTextFieldWithValidation
                    rules="regex:^[0-9]*$"
                    label="الخصم"
                    v-model="admin.offer"
                    prepend-icon="lock"
                    type="text"
                  />
                  
                  <VSelectWithValidation
                    label="الفئات #"
                    rules="required"
                    :items="category_ids"
                    item-text="name"
                    item-value="id"
                    prepend-icon="lock"
                    v-model="admin.category_id"
                  />
                                  
                </v-card-text>

                <hr/>

                <!-- Media -->
                <v-card-text>
                  <div class="d-flex align-items-center">
                    <h4>الوسائط</h4>

                    <v-spacer></v-spacer>
                    
                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          fab
                          small
                          v-bind="attrs"
                          v-on="on"
                          @click="addMedia()"
                        >
                          <v-icon>add</v-icon>
                        </v-btn>
                      </template>
                      <span>اضافة عنصر جديد</span>
                    </v-tooltip>
                  </div>

                  <div v-for="(find, index) in admin.media">
                    <div class="d-flex align-items-center">
                      <VFileInputWithValidation
                        class="w-100"
                        :rules="edit === true ? '' : 'required'"
                        label="صورة الوسائط"
                        variant="filled"
                        prepend-icon="camera"
                        v-model="find.value" 
                        :key="index"
                      />
                      <div class="text-center">
                        <span v-if="!find.view_image">لا يوجد صورة</span>
                        <div v-else-if="typeof find.view_image === 'object'"></div>

                        <a v-else :href="`${imageBaseUrl}/${find.view_image}`" target="_blank">
                          <img class="of-contain"
                            :src="`${imageBaseUrl}/${find.view_image}`"
                            alt="صورة المنتج"
                          />
                        </a>
                      </div>
                      
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="mx-3"
                            color="red"
                            icon
                            x-small
                            v-bind="attrs"
                            v-on="on"
                            @click="deleteMedia(index)"
                          >
                            <v-icon>delete_forever</v-icon>
                          </v-btn>
                        </template>
                        <span>حذف</span>
                      </v-tooltip>
                    </div>
                    <div class="fz12 text-red" v-if="showMediaError">
                      يجب ادخال وسيط واحد على الأقل
                    </div>
                  </div>
                </v-card-text>

                <hr/>

                <!-- Slider -->
                <v-card-text>
                  <template>
                    <v-container fluid>
                      <v-checkbox
                        v-model="admin.slider"
                        :label="`سلايدر ؟`"
                      ></v-checkbox>
                    </v-container>
                  </template>
                  
                  <div class="d-flex align-items-center" v-if="admin.slider">
                    <VFileInputWithValidation
                      class="w-100 me-2"
                      label="صورة السلايدر"
                      variant="filled"
                      prepend-icon="camera"
                      v-model="admin.slider_image" 
                      :key="index"
                    />
                    <div class="text-center">
                      <span v-if="!admin.view_slider_image">لا يوجد صورة</span>
                      <div v-else-if="typeof admin.view_slider_image === 'object'"></div>

                      <a v-else :href="`${imageBaseUrl}/${admin.view_slider_image}`" target="_blank">
                        <img class="of-contain"
                          :src="`${imageBaseUrl}/${admin.view_slider_image}`"
                          alt="صورة السلايدر"
                        />
                      </a>
                    </div>
                  </div>
                </v-card-text>

                <hr/>

                <!-- Colors -->
                <v-card-text>  
                  <div class="d-flex align-items-center">
                    <h4>الألوان</h4>

                    <v-spacer></v-spacer>
                    
                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          fab
                          small
                          v-bind="attrs"
                          v-on="on"
                          @click="addColor()"
                        >
                          <v-icon>add</v-icon>
                        </v-btn>
                      </template>
                      <span>اضافة لون جديد</span>
                    </v-tooltip>
                  </div>

                  <!-- Colors Field List -->
                  <div v-for="(color, index) in admin.colors">
                    <div class="d-flex align-items-center mt-3">
                      <!-- Color Field Item -->
                      <div class="w-100">
                        <VTextFieldWithValidation
                          rules="required|regex:^[0-9]*$"
                          prepend-icon="lock"
                          v-model="color.stock" 
                          :key="index"
                          label="المخزون"
                          type="text"
                        />
                        
                        <VSelectColorWithValidation
                          label="الألوان"
                          rules="required"
                          :items="color_ids"
                          item-text="code"
                          item-value="id"
                          prepend-icon="lock"
                          class="w-100"
                          v-model="color.color_id" 
                          :key="index"
                          @change="getColorCode(color.color_id)"
                        />

                        <!-- Color Media Field List -->
                        <div class="d-flex align-items-center">
                          <!-- Add Color Media -->
                          <v-tooltip left>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn 
                                class="ml-2"
                                color="primary"
                                fab
                                small
                                v-bind="attrs"
                                v-on="on"
                                @click="addColorMedia(index)"
                              >
                                <v-icon>add</v-icon>
                              </v-btn>
                            </template>
                            <span>اضافة صورة لون جديد</span>
                          </v-tooltip>

                          <!-- Color Media List -->
                          <div class="w-100">
                            <div v-for="(med, key) in color.media">
                              <div class="d-flex align-items-center">
                                <div class="w-100">
                                  <VFileInputWithValidation
                                    label="صورة الوسائط"
                                    prepend-icon="camera"
                                    v-model="med.value" 
                                    :key="key"
                                  />
                                </div>

                                <div class="text-center">
                                  <span v-if="med.view_image === null || med.view_image === ''">لا يوجد صورة</span>
                                  <div v-else-if="typeof med.view_image === 'object'"></div>

                                  <a v-else :href="`${imageBaseUrl}/${med.view_image}`" target="_blank">
                                    <img class="of-contain"
                                      :src="`${imageBaseUrl}/${med.view_image}`"
                                      alt="صورة المنتج"
                                    />
                                  </a>
                                </div>

                                <!-- Delete Color Media -->
                                <div left>
                                  <v-tooltip>
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                        class="mx-3"
                                        color="red"
                                        icon
                                        x-small
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="deleteColorMedia(index, key)"
                                      >
                                        <v-icon>delete_forever</v-icon>
                                      </v-btn>
                                    </template>
                                    <span>حذف صورة لون</span>
                                  </v-tooltip>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Delete Color Item -->
                      <div left>
                        <v-tooltip>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              class="mx-3"
                              color="red"
                              icon
                              small
                              v-bind="attrs"
                              v-on="on"
                              @click="deleteColor(key)"
                            >
                              <v-icon>delete_forever</v-icon>
                            </v-btn>
                          </template>
                          <span>حذف لون</span>
                        </v-tooltip>
                      </div>
                    </div>
                    <div class="fz12 text-warning" v-if="showColorError">
                      هل أنت متأكد من أنك لا تريد إضافة لون
                    </div>

                    <hr/>
                  </div>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    type="submit"
                    :disabled="invalid || connecting"
                    :loading="connecting"
                    color="primary">حفظ
                  </v-btn>
                  <v-btn @click="close" color="secondary">إغلاق</v-btn>
                </v-card-actions>
              </form>
            </ValidationObserver>
          </v-card>
        </v-dialog>
        <!-- End Add/Edit Dialog Form -->

        <!-- Start View Description Dialog Form -->
        <v-dialog v-model="viewDescriptionDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span>وصف المنتج</span>
              <v-spacer></v-spacer>
              <v-btn icon small @click="close">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="text-xs-center">
              {{ productDiscription }}
            </v-card-text>
            <hr/>
            <v-card-text v-if="reviews && reviews.length > 0">
              <div v-for="review in reviews">
                <h3 class="mt-3">{{ review.user.name }}</h3>
                <div><span class="fbold">التقييم: </span><span class="text-warning">{{ review.review }}</span>/5</div>
                <div class="mt-3 mb-3"><span class="fbold">التعليق: </span> "{{ review.comment }}"</div>
                <hr/>
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
        <!-- Center QR Code Properly -->
        <div class="d-flex justify-center qrcode-print">
          <vue-qrcode :text="String(print_info.id)" :size="50" ></vue-qrcode>
        </div>
        <!-- Center Text -->
        <div class=" text-center product-id" >
          {{ print_info.id }}
        </div>
        <div class=" text-center product-name">
          {{ print_info.name }}
        </div>
        <!-- Center the Span -->
        <div class="pt-1 text-center">
          <span class="px-2 printing-padding" style="border:1px solid black">
            HoorBook - حور بوك
          </span>                  
        </div> 
      
    </v-card-text>
    <v-card-actions>
      <v-btn @click="print" color="primary">طباعة</v-btn>
      <v-btn @click="close" color="secondary">إغلاق</v-btn>
    </v-card-actions>
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
                          label="الفئة"
                          :items="category_ids"
                          item-text="name"
                          item-value="id"
                          prepend-icon="lock"
                          v-model="filter.category_id"
                        />
                      </v-col>

                      <v-col class="pa-2" cols="12" lg="4" sm="6">
                        <VSelectWithValidation
                          label="رتب حسب المخزون"
                          :items="stock_sorting_kinds"
                          item-text="name"
                          item-value="value"
                          prepend-icon="lock"
                          v-model="filter.sortingModel.sortingDirection"
                        />
                      </v-col>

                      <v-col class="pa-2" cols="12" lg="4" sm="6">
                        <VTextFieldWithValidation
                          label="كود المنتج"
                          v-model="filter.serial_number"
                          prepend-icon="lock"
                          type="text"
                        />
                      </v-col>

                      <v-col class="pa-2" cols="12" lg="4" sm="6">
                        <v-checkbox
                          v-model="filter.deleted_at"
                          label="المنتجات المحذوفة مؤقتا"
                          color="success"
                          ></v-checkbox>
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

        <template v-slot:[`item.image`]="{ item }">
          <!--  -->
          <div>
            <a :href="`${imageBaseUrl}/${item.image}`" target="_blank">
              <img
                class="of-contain"
                :src="`${imageBaseUrl}/${item.image}`"
                alt="صورة المنتج"
              />
            </a>
          </div>
        </template>

        <template v-slot:[`item.name`]="{ item }">
          <div class="py-3">
            <div v-if="item.name != null">
              <div class="font-weight-bold">الاسم:</div>
              {{ item.name }}
            </div>
            <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>

            <div v-if="item.name_ar != null">
              <div class="font-weight-bold">الاسم بالعربي:</div>
              {{ item.name_ar }}
            </div>


            <div v-if="item.searching_name != null">
              <div class="font-weight-bold"> الاسم للبحث:</div>
              {{ item.searching_name }}
            </div>
            <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>

            <div v-if="item.searching_name_ar != null">
              <div class="font-weight-bold">الاسم بالعربي للبحث:</div>
              {{ item.searching_name_ar }}
            </div>
            
            <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>            
          </div>
        </template>

        <template v-slot:[`item.category`]="{ item }">
          <div v-if="item.category != null">
            <div><b># </b>{{ item.category.id }}</div>
            <div><b>الاسم: </b>{{ item.category.name }}</div>
            <div v-if="item.category.name_ar != null"><b>الاسم بالعربي: </b>{{ item.category.name_ar }}</div>
            <div class="mt-2">
              <div>
                <a :href="`${imageBaseUrl}/${item.category.image}`" target="_blank">
                  <img
                    :src="`${imageBaseUrl}/${item.category.image}`" class="of-contain"
                    alt="صورة الفئة"
                  />
                </a>
              </div>
            </div>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.colors`]="{ item }">
          <span v-if="item.colors != null">{{ item.colors.length }}</span>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.media`]="{ item }">
          <span v-if="item.media != null">{{ item.media.length }}</span>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.packet_pieces`]="{ item }">
          <div v-if="item.packet_pieces != null">
            <b>العدد: </b> {{ item.packet_pieces }}
          </div>
          <div v-if="item.user_price_of_packet != null">
            <b>سعر الدستة بالنسبة للمستخدم: </b> {{ item.user_price_of_packet }}
          </div>
          <div v-if="item.library_price_of_packet != null">
            <b>سعر الدستة بالنسبة للمكتبة: </b> {{ item.library_price_of_packet }}
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.user_price_of_piece`]="{ item }">
          <div v-if="item.user_price_of_piece != null">
            <b>سعر القطعة بالنسبة للمستخدم: </b> {{ item.user_price_of_piece }}
          </div>
          <div v-if="item.library_price_of_piece != null">
            <b>سعر القطعة بالنسبة للمكتبة: </b> {{ item.library_price_of_piece }}
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>


        <template v-slot:[`item.reviews_avg`]="{ item }">
          <div v-if="item.reviews_avg != null">
            <b>متوسط التقييمات: </b> {{ item.reviews_avg }}
          </div>
          <div v-if="item.reviews.length != null">
            <b>عدد التقييمات: </b> {{ item.reviews.length }}
          </div>
          <div v-if="item.stock != null">
            <b>المخزون: </b> {{ item.stock }}
          </div>
          <div v-if="item.offer != null">
            <b>الخصم: </b> {{ item.offer }}%
          </div>
          <div v-if="item.created_at != null">
            <b>تاريخ الانشاء: </b> {{ item.created_at }}
          </div>
          <div v-if="item.updated_at != null">
            <b>تاريخ التحديث: </b> {{ item.updated_at }}
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <!-- start async admin/role action -->
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="blue"
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click="viewDescription(item)"
              >
                <v-icon>verified_user</v-icon>
              </v-btn>
            </template>
            <span>عرض وصف المنتج</span>
          </v-tooltip>
          <!-- end async admin/role action -->

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


          <v-tooltip v-if="item.deleted_at == null" right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="orange"
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click="softdeleteItem(item)"
              >
                <v-icon>not_interested</v-icon>
              </v-btn>
            </template>
            <span>تعطيل {{ item.name }} </span>
          </v-tooltip>
          <!-- end deactivate action -->
          <!-- start deactivate action -->
          <v-tooltip v-if="item.deleted_at !== null" right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="green"
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click="restoreItem(item)"
              >
                <v-icon>restore</v-icon>
              </v-btn>
            </template>
            <span>تنشيط {{ item.name }} </span>
          </v-tooltip>
          <!-- end deactivate action -->
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
import VFileInputWithValidation from "../components/inputs/VFileInputWithValidation";
import VSelectWithValidation from "../components/inputs/VSelectWithValidation";
import VSelectColorWithValidation from "../components/inputs/VSelectColorWithValidation";
import VTextAreaWithValidation from "../components/inputs/VTextAreaWithValidation";

import { mapActions } from "vuex";
import { BASE_API, BASE_URL } from "../config/config";
import VueQrcode from "vue-qrcode-component";

export default {
  props: {
    title: {
      default: "المنتجات",
      type: String,
    },
    api: {
      default: "products",
      type: String,
    },
  },
  data: () => ({
    admin: {
      name: "",
      name_ar: "",
      searching_name: "",
      searching_name_ar: "",
      desc: "",
      stock: null,
      user_price_of_piece: null,
      library_price_of_piece: null,
      packet_pieces: null,
      user_price_of_packet: null,
      library_price_of_packet: null,
      serial_number:null,
      piece_wholesale_price:0,
      packet_wholesale_price:0,
      offer: null,
      qrcode:"",
      image: "",
      category_id: null,
      media: [],
      colors: [],
      slider_image: "",
      slider: false,
    },
    print_info: null,
    filter: {
      name: "",
      name_ar: "",
      searching_name: "",
      searching_name_ar: "",
      serial_number: "",
      category_id: null,
      deleted_at: false,
      sortingModel:{
        sortingExpression:'stock',
        sortingDirection: null
      }
    },
    isFiltering: false,
    panel: [ 0 ],
    productDiscription: "",
    reviews: [],
    viewDescriptionDialog: false,
    connecting: false,
    errors: [],
    edit: false,
    dialog: false,
    requests: [],
    category_ids: [],
    stock_sorting_kinds:[
      {
        'name':'من الاصغر للاكبر',
        "value" : "asc"
      },
      {
        'name':"من الاكبر للاصغر",
        "value":"desc"
      }
  ],
    color_ids: [],
    totalRequests: 0,
    pagination: {},
    loading: false,
    headers: [
      { text: "#", value: "id", ...headerConst },
      { text: "الصورة", value: "image", ...headerConst },
      { text: "الإسم", value: "name", ...headerConst },
      { text: "الفئة", value: "category", ...headerConst },
      { text: "الألوان", value: "colors", ...headerConst },
      { text: "الوسائط", value: "media", ...headerConst },
      { text: "الدستة", value: "packet_pieces", ...headerConst },
      { text: "القطعة", value: "user_price_of_piece", ...headerConst },
      { text: "معلومات اضافية", value: "reviews_avg", ...headerConst },
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
    showMediaError: false,
    showColorError: false,
    showColorMediaError: false,
    baseApi: BASE_API,
    imageBaseUrl: BASE_URL.replace(/\/$/, ''),
    color_code: null,
  }),
  components: {
    VTextFieldWithValidation,
    VFileInputWithValidation,
    VSelectWithValidation,
    VSelectColorWithValidation,
    VTextAreaWithValidation,
    VueQrcode
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
    this.getCategoriesId();
    this.getColorIds();
  },
  methods: {
    ...mapActions(["showNotification"]),
    viewPrintDialog(item) {
      this.printDialog = !this.printDialog;
      this.print_info = item;
      console.log('print_info >>', this.print_info);
    },
    print() {
    const printContent = document.getElementById('print_info').innerHTML;
    const printWindow = window.open('', '_blank', 'width=600,height=400');

    printWindow.document.open();

    // Define print styles
    const styles = `
  <style>
    @media print {
      .qrcode-print {  
        display: flex; 
        justify-content: center; 
        align-items: center;
        margin-bottom: 2px; /* Reduce space below QR code */
      }

      .product-id,  
      .product-name {  
        margin: 1px 0;  /* Minimal space */
        padding: 0;  /* Remove any padding */
        text-align: center; 
        font-size: 16px; /* Slightly smaller font */
        line-height: 1.2; /* Reduce line height */
      }

      .printing-padding {  
        padding: 3px; /* Reduce padding */
        border: 1px solid black; 
        display: block; 
        text-align: center; 
        width: fit-content;  
        margin: 3px auto; /* Reduce spacing */
      }
    }
  </style>
`;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          ${styles}
        </head>
        <body>
          <div class="qr-container">
            ${printContent}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }, 500);
},

    fetch() {
      this.getDataFromApi().then((data) => {
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
    getDataFromApi(filter = null) {
      this.loading = true;
      return new Promise((resolve) => {
        if (filter == null) {
          let endpoint = `${this.baseApi}/api/admin/products?page=${this.page}`;

          this.$http.get(endpoint).then((res) => {
            this.isFiltering = false;
            let items = res.data.data;
            //console.log('getDataFromApi items >>', items);
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
        }
        else {
          let endpoint = `${this.baseApi}/api/admin/products?page=${this.page}`;

          this.$http.get(endpoint).then((res) => {
            let items = res.data.data;
            //console.log('items >>', items);
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
        }
      });
    },
    filterDataFromApi() {
      this.loading = true;
      return new Promise((resolve) => {
        let endpoint = `${this.baseApi}/api/admin/products?page=${this.page}`;
        if (this.filter.name != '') endpoint += `&name=${this.filter.name}`;
        if (this.filter.category_id != null) endpoint += `&category_id=${this.filter.category_id}`;
        if (this.filter.deleted_at != false) endpoint += `&deleted_at=${this.filter.deleted_at}`;
        if (this.filter.serial_number != false) endpoint += `&serial_number=${this.filter.serial_number}`;
        if (this.filter.sortingModel.sortingDirection != null) {
    endpoint += `&sortingModel[sortingExpression]=${encodeURIComponent(this.filter.sortingModel.sortingExpression)}` +
                `&sortingModel[sortingDirection]=${encodeURIComponent(this.filter.sortingModel.sortingDirection)}`;
}
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
        name: "",
        name_ar: "",
        searching_name: "",
        searching_name_ar: "",
        serial_number:"",
        deleted_at:false,
        category_id: null,
        sortingModel:{
            sortingExpression:'stock',
            sortingDirection: null
      }
      };
    },
    close() {
      this.errors = [];
      this.dialog = false;
      this.print_info = null;
      this.printDialog = false;
      this.viewDescriptionDialog = false;
      this.admin = {
        name: "",
        name_ar: "",
        searching_name: "",
        searching_name_ar: "",
        desc: "",
        stock: null,
        user_price_of_piece: null,
        library_price_of_piece: null,
        packet_pieces: null,
        user_price_of_packet: null,
        library_price_of_packet: null,
        serial_number:null,
        offer: null,
        image: "",
        category_id: null,
        media: [],
        colors: [],
        slider: false,
        slider_image: "",
      };
      this.productDiscription = "";
      this.reviews = [];
    },
    editing(process, item = this.admin) {
      if (process === "add") {
        this.addMedia();
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
      if (item) {
        this.admin.id = item.id;
        this.admin.name = item.name;
        this.admin.name_ar = item.name_ar;
        this.admin.searching_name = item.searching_name;
        this.admin.searching_name_ar = item.searching_name_ar;
        this.admin.desc = item.desc;
        this.admin.stock = item.stock;
        this.admin.user_price_of_piece = item.user_price_of_piece;
        this.admin.library_price_of_piece = item.library_price_of_piece;
        this.admin.packet_pieces = item.packet_pieces ? item.packet_pieces : '0';
        this.admin.user_price_of_packet = item.user_price_of_packet;
        this.admin.library_price_of_packet = item.library_price_of_packet;
        this.admin.serial_number = item.serial_number;        
        this.admin.piece_wholesale_price = item.piece_wholesale_price;
        this.admin.packet_wholesale_price = item.packet_wholesale_price;
        this.admin.offer = item.offer;
        this.admin.view_image = item.image;
        this.admin.image = "";
        this.admin.slider = item.slider === null ? false : true;
        this.admin.slider_image = "";
        if(item.slider) this.admin.view_slider_image = item.slider.image;
        this.admin.category_id = item.category.id;
        if (item.media && item.media.length > 0) {
          for (var i = 0; i < item.media.length; i++) {
            this.addMedia(item.media[i]);
          }
        }
        if (item.colors && item.colors.length > 0) {
          for (var i = 0; i < item.colors.length; i++) {
            this.addColor(item.colors[i]);
            if (item.media && item.media.length > 0 && item.colors[i].media && item.colors[i].media.length > 0) {
              this.addColorMedia(i, item.colors[i].media, item.media);
            }
          }
        }
      }
    },
    saveItem() {
      this.connecting = true;
      let formdata = new FormData();
      if (this.admin.name) formdata.append("name", this.admin.name);
      if (this.admin.name_ar) formdata.append("name_ar", this.admin.name_ar);
      if (this.admin.searching_name) formdata.append("searching_name", this.admin.searching_name);
      if (this.admin.searching_name_ar) formdata.append("searching_name_ar", this.admin.searching_name_ar);
      if (this.admin.desc) formdata.append("desc", this.admin.desc);
      if (this.admin.stock) formdata.append("stock", Number(this.admin.stock));
      if (this.admin.user_price_of_piece) formdata.append("user_price_of_piece", Number(this.admin.user_price_of_piece));
      if (this.admin.library_price_of_piece) formdata.append("library_price_of_piece", Number(this.admin.library_price_of_piece));
      if (this.admin.packet_pieces) formdata.append("packet_pieces", Number(this.admin.packet_pieces));
      if (this.admin.user_price_of_packet) formdata.append("user_price_of_packet", Number(this.admin.user_price_of_packet));
      if (this.admin.library_price_of_packet) formdata.append("library_price_of_packet", Number(this.admin.library_price_of_packet));
      if (this.admin.serial_number) formdata.append("serial_number", this.admin.serial_number);
      if (this.admin.piece_wholesale_price) formdata.append("piece_wholesale_price", Number(this.admin.piece_wholesale_price));
      if (this.admin.packet_wholesale_price) formdata.append("packet_wholesale_price", Number(this.admin.packet_wholesale_price));
      if (this.admin.offer) formdata.append("offer", Number(this.admin.offer));
      if (this.admin.image) formdata.append("image", this.admin.image);
      if (this.admin.category_id) formdata.append("category_id", this.admin.category_id);
      formdata.append("slider", this.admin.slider);
      if ((this.admin.slider) && this.admin.slider_image) formdata.append("slider_image", this.admin.slider_image);
      //if (this.admin.media) formdata.append("media[]", this.admin.media);
      if (this.admin.media && this.admin.media.length > 0) {
        for (var i = 0; i < this.admin.media.length; i++) {
          if (this.admin.media[i].value) {
            formdata.append('media[]', this.admin.media[i].value);
          }
        }
      }
      if (this.admin.colors && this.admin.colors.length > 0) {
        for (var i = 0; i < this.admin.colors.length; i++) {
          //formdata.append(`colors[]`, this.admin.colors[ i ]);
          var object = this.admin.colors[i];
          for (var key in object) {
            if (object.hasOwnProperty(key)) {
              if (key == 'media') {
                for (var x = 0; x < object[key].length; x++) {
                  if (object[key][x].value) {
                    formdata.append('colors[' + i + '][media]['+ x +']', object[key][x].value);
                  }
                }
              }
              else {
                formdata.append('colors[' + i + '][' + key + ']', object[key]);
              }
            }
          }
        }
      }

      if (this.edit) {
        let endpoint = `${this.baseApi}/api/admin/products/${this.admin.id}`;
        
        this.$http
          .post(endpoint, formdata)
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
                name: "",
                name_ar: "",
                searching_name: "",
                searching_name_ar: "",
                desc: "",
                stock: null,
                user_price_of_piece: null,
                library_price_of_piece: null,
                packet_pieces: null,
                user_price_of_packet: null,
                library_price_of_packet: null,
                serial_number: null,
                piece_wholesale_price: 0,
                packet_wholesale_price: 0,
                offer: null,
                image: "",
                category_id: null,
                media: [],
                colors: [],
                slider: false,
                slider_image: ""
              };
              this.connecting = false;
            }
          })
          .catch(({ response }) => {
            this.errors = response.data.errors;
            this.connecting = false;
          });
      }
      else {
        this.$http
          .post(`${this.baseApi}/api/admin/products`, formdata)
          .then((res) => {
            if (res.data && res.data.status && !res.data.status.status) { 
              this.showNotification(res.data.status.validation_message);
              this.connecting = false;
            }
            else {
              this.showNotification("تمت العملية بنجاح");
              this.fetch();
              this.alert.type = "info";
              this.alert.message = "Add user done!";
              this.close();
              this.errors = [];
              this.admin = {
                id: null,
                name: "",
                name_ar: "",
                searching_name: "",
                searching_name_ar: "",
                desc: "",
                stock: null,
                user_price_of_piece: null,
                library_price_of_piece: null,
                packet_pieces: null,
                user_price_of_packet: null,
                library_price_of_packet: null,
                serial_number: null,
                piece_wholesale_price:0,
                packet_wholesale_price:0,
                offer: null,
                image: "",
                category_id: null,
                media: [],
                colors: [],
                slider: false,
                slider_image: ""
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
        this.$http.delete(`${this.baseApi}/api/admin/products/${item.id}`).then((res) => {
          this.showNotification("تمت العملية بنجاح");
          this.fetch();
          this.alert.message = "Delete Product done";
          this.alert.type = "success";
        });
      }
    },
    softdeleteItem(item) {
       // const index = this.requests.indexOf(item);
       if (confirm("هل تود توقيف  هذا العنصر ؟")) {
        this.$http.delete(`${this.baseApi}/api/admin/products/softDelete/${item.id}`).then((res) => {
          this.showNotification("تمت العملية بنجاح");
          this.fetch();
          this.alert.message = "Stop product done";
          this.alert.type = "success";
        });
      }
    },
    restoreItem(item) {
       // const index = this.requests.indexOf(item);
       if (confirm("هل تود استرجاع  هذا العنصر ؟")) {
        this.$http.delete(`${this.baseApi}/api/admin/products/restore/${item.id}`).then((res) => {
          this.showNotification("تمت العملية بنجاح");
          this.fetch();
          this.alert.message = "restore product done";
          this.alert.type = "success";
        });
      }
    },
    viewDescription(item) {
      this.viewDescriptionDialog = !this.viewDescriptionDialog;
      this.productDiscription = item.desc;
      this.reviews = item.reviews
    },
    getCategoriesId(res = null) {
      this.loading = true;
      return new Promise(() => {
        if (res == null) {
          let endpoint = `${this.baseApi}/api/admin/categories?noPaginate=1`;

          this.$http.get(endpoint).then((res) => {
            let items = res.data.map((item) => {
              return {
                id: item.id,
                name: item.name_ar
              };
            });
            this.category_ids = items;
          });
        }
      });
    },
    getColorIds(res = null) {
      this.loading = true;
      return new Promise(() => {
        if (res == null) {
          let endpoint = `${this.baseApi}/api/admin/colors?noPaginate=1`;

          this.$http.get(endpoint).then((res) => {
            let items = res.data.map((item) => {
              return {
                id: item.id,
                code: item.code
              };
            });
            //console.log('getColorIds items >>', items);
            this.color_ids = items;
          });
        }
      });
    },
    getColorCode(codeId) {
      if (codeId) {
        let color = this.color_ids.find((item) => { 
          if (item.id == codeId) {
            return item;
          }
        })
        this.color_code = color.code;
      }
      else {
        return null;
      }
    },
    addMedia: function (item) {
      if (!item) {
        this.admin.media.push({
          value: "",
          view_image: ""
        });
      }
      else {
        if (!item.color_id) {
          this.admin.media.push({
            value: "",
            view_image: item.image
          });
        }
      }
      this.showMediaError = false;
    },
    deleteMedia: function (index) {
      if (this.admin.media.length > 1) {
        this.admin.media.splice(index, 1);
        this.showMediaError = false;
      }
      else {
        this.showMediaError = true;
      }
    },
    addColor: function (item) {
      if (!item) {
        this.admin.colors.push({
          color_id: null,
          stock: null,
          media: []
        });
        this.addColorMedia(this.admin.colors.length - 1);
      }
      else {
        this.admin.colors.push(
          {
            color_id: item.id,
            stock: item.stock,
            media: []
          }
        );
      }
      this.showColorError = false;
    },
    addColorMedia: function (index, item, media) {
      if (!item) {
        this.admin.colors[index].media.push({ value: '' });
      }
      else {
        for (let i = 0; i < item.length; i++) {
          this.admin.colors[index].media.push({ view_image: media[item[i]].image });
        }
      }
      this.showColorError = false;
    },
    deleteColor: function (index) {
      this.admin.colors.splice(index, 1);
      if (this.admin.colors.length < 1) {
        this.showColorError = true;
      }
      else {
        this.showColorError = false;
      }
    },
    deleteColorMedia: function (colorIndex, mediaIndex) {
      this.admin.colors[colorIndex].media.splice(mediaIndex, 1);
    },
  },
};
</script>

<style scoped lang="scss">
.d-flex {
  display: flex;
}
.w-100 {
  width: 100%;
}
.align-items-center {
  align-items: center;
}
.fz12 {
  font-size: 12px;
} 
.text-red {
  color: red;
}
.text-warning {
  color: goldenrod;
}
.fbold {
  font-weight: 700 !important; 
}
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
