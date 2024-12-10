import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import Ripple from 'primevue/ripple';
import ConfirmationService from 'primevue/confirmationservice';


import App from './App.vue'
import router from './router'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import './config/yup'
const app = createApp(App)

app.use(PrimeVue, {
	unstyled: false,
	ripple: true,
	theme: {
		preset: Aura,
		options: {
			darkModeSelector: ''
		}
	}
});

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)
app.use(Toast);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.directive('tooltip', Tooltip);
app.directive('ripple', Ripple);

app.mount('#app')
