// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    'Manage Accounts': 'Manage Accounts',
                    'Account Info': 'Account Info',
                    'Reset Password': 'Reset Password',
                    'Manage Projects': 'Manage Projects',
                    'Project Info': 'Project Info',
                    'Assign Employees': 'Assign Employees',
                    'Project Tracking': 'Project Tracking',
                    'Technology': 'Technology',
                    'Technology Info': 'Technology Info',
                    'Employee': 'Employee',
                    'Employee Profile': 'Employee Profile',
                    'Languages': 'Languages',
                    'Programming Language Info': 'Programming Language Info',
                    'Translate': 'Translate',
                    'Vietnamese': 'Vietnamese',
                    'English': 'English',
                    'CV': 'CV',
                }
            },
            vi: {
                translation: {
                    'Manage Accounts': 'Quản lý Tài khoản',
                    'Account Info': 'Thông tin Tài khoản',
                    'Reset Password': 'Đặt lại Mật khẩu',
                    'Manage Projects': 'Quản lý Dự án',
                    'Project Info': 'Thông tin Dự án',
                    'Assign Employees': 'Phân công Nhân viên',
                    'Project Tracking': 'Theo dõi Dự án',
                    'Technology': 'Công nghệ',
                    'Technology Info': 'Thông tin Công nghệ',
                    'Employee': 'Nhân viên',
                    'Employee Profile': 'Hồ sơ Nhân viên',
                    'Languages': 'Ngôn ngữ',
                    'Programming Language Info': 'Thông tin Ngôn ngữ Lập trình',
                    'Translate': 'Dịch',
                    'Vietnamese': 'Tiếng Việt',
                    'English': 'Tiếng Anh',
                    'CV': 'Sơ yếu lý lịch',
                }
            }
        },
        lng: 'en', // Ngôn ngữ mặc định
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
