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
                    'Admin Page': 'Admin Page',
                    'Add User': 'Add User',
                    'Edit User': 'Edit User',
                    'Email': 'Email',
                    'Role': 'Role',
                    'Status': 'Status',
                    'Active': 'Active',
                    'Inactive': 'Inactive',
                    'Please input your email!': 'Please input your email!',
                    'Please select a role!': 'Please select a role!',
                    'Please select a status!': 'Please select a status!',
                    'Update User': 'Update User',
                    'Current Users': 'Current Users',
                    'Actions': 'Actions',
                    'Delete': 'Delete',
                    'Edit': 'Edit',
                    'Export to Excel': 'Export to Excel',
                    'Logout': 'Logout',
                    'Admin': 'Admin',
                    'Change Password': 'Change Password',
                    'Current Password': 'Current Password',
                    'New Password': 'New Password',
                    'Confirm New Password': 'Confirm New Password',
                    'Please input your current password!': 'Please input your current password!',
                    'Please input your new password!': 'Please input your new password!',
                    'Please confirm your new password!': 'Please confirm your new password!',
                    'New passwords do not match.': 'New passwords do not match.',
                    'Current password is incorrect.': 'Current password is incorrect.',
                    'Password changed successfully!': 'Password changed successfully!',
                    'Failed to change password. Please try again.': 'Failed to change password. Please try again.',
                    'Name': 'Name',
                    'Type': 'Type',
                    'Description': 'Description',
                    'Add Programming Language': 'Add Programming Language',
                    'Failed to fetch programmingLanguages.': 'Failed to fetch programmingLanguages.',
                    'Programming Languages deleted successfully!': 'Programming Languages deleted successfully!',
                    'Failed to delete Programming Languages.': 'Failed to delete Programming Languages.',
                    'Add New Programming Language': 'Add New Programming Language',
                    'Programming Language Name': 'Programming Language Name',
                    'Please input Programming Language Name!': 'Please input Programming Language Name!',
                    'Programming Language Type': 'Programming Language Type',
                    'Please input Programming Language Type!': 'Please input Programming Language Type!',
                    'Programming Language Status': 'Programming Language Status',
                    'Please select Programming Language Status!': 'Please select Programming Language Status!',
                    'Programming Language Description': 'Programming Language Description',
                    'Submit': 'Submit',
                    'Programming Languages added successfully!': 'Programming Languages added successfully!',
                    'Failed to add programming languages.': 'Failed to add programming languages.',
                    'Edit Programming Languages': 'Edit Programming Languages',
                    'Programming Languages updated successfully!': 'Programming Languages updated successfully!',
                    'Failed to update Programming Languages.': 'Failed to update Programming Languages.',
                    'Tech Name': 'Tech Name',
                    'Tech Type': 'Tech Type',
                    'Tech Description': 'Tech Description',
                    'Tech Status': 'Tech Status',
                    'Add Tech': 'Add Tech',
                    'Edit Tech': 'Edit Tech',
                    'Failed to fetch technologies.': 'Failed to fetch technologies.',
                    'Technology deleted successfully!': 'Technology deleted successfully!',
                    'Failed to delete technology.': 'Failed to delete technology.',
                    'Add New Technology': 'Add New Technology',
                    'Please input Tech Name!': 'Please input Tech Name!',
                    'Please input Tech Type!': 'Please input Tech Type!',
                    'Please select Tech Status!': 'Please select Tech Status!',
                    'Technology added successfully!': 'Technology added successfully!',
                    'Error adding technology:': 'Error adding technology:',
                    'Failed to add technology.': 'Failed to add technology.',
                    'Edit Technology': 'Edit Technology',
                    'Technology updated successfully!': 'Technology updated successfully!',
                    'Failed to update technology.': 'Failed to update technology.',

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
                    'Admin Page': 'Trang Quản trị',
                    'Add User': 'Thêm người dùng',
                    'Edit User': 'Chỉnh sửa người dùng',
                    'Email': 'Email',
                    'Role': 'Vai trò',
                    'Status': 'Trạng thái',
                    'Active': 'Hoạt động',
                    'Inactive': 'Không hoạt động',
                    'Please input your email!': 'Vui lòng nhập email của bạn!',
                    'Please select a role!': 'Vui lòng chọn vai trò!',
                    'Please select a status!': 'Vui lòng chọn trạng thái!',
                    'Update User': 'Cập nhật người dùng',
                    'Current Users': 'Người dùng hiện tại',
                    'Actions': 'Hành động',
                    'Delete': 'Xóa',
                    'Edit': 'Chỉnh sửa',
                    'Export to Excel': 'Xuất ra Excel',
                    'Logout': 'Đăng xuất',
                    'Admin': 'Quản trị viên',
                    'Change Password': 'Đổi mật khẩu',
                    'Current Password': 'Mật khẩu hiện tại',
                    'New Password': 'Mật khẩu mới',
                    'Confirm New Password': 'Xác nhận mật khẩu mới',
                    'Please input your current password!': 'Vui lòng nhập mật khẩu hiện tại của bạn!',
                    'Please input your new password!': 'Vui lòng nhập mật khẩu mới của bạn!',
                    'Please confirm your new password!': 'Vui lòng xác nhận mật khẩu mới của bạn!',
                    'New passwords do not match.': 'Mật khẩu mới không khớp.',
                    'Current password is incorrect.': 'Mật khẩu hiện tại không đúng.',
                    'Password changed successfully!': 'Đổi mật khẩu thành công!',
                    'Failed to change password. Please try again.': 'Đổi mật khẩu thất bại. Vui lòng thử lại.',
                    'Name': 'Tên',
                    'Type': 'Loại',
                    'Description': 'Mô tả',
                    'Add Programming Language': 'Thêm Ngôn ngữ Lập trình',
                    'Failed to fetch programmingLanguages.': 'Không thể lấy thông tin ngôn ngữ lập trình.',
                    'Programming Languages deleted successfully!': 'Xóa ngôn ngữ lập trình thành công!',
                    'Failed to delete Programming Languages.': 'Không thể xóa ngôn ngữ lập trình.',
                    'Add New Programming Language': 'Thêm Ngôn ngữ Lập trình Mới',
                    'Programming Language Name': 'Tên Ngôn ngữ Lập trình',
                    'Please input Programming Language Name!': 'Vui lòng nhập tên Ngôn ngữ Lập trình!',
                    'Programming Language Type': 'Loại Ngôn ngữ Lập trình',
                    'Please input Programming Language Type!': 'Vui lòng nhập loại Ngôn ngữ Lập trình!',
                    'Programming Language Status': 'Trạng thái Ngôn ngữ Lập trình',
                    'Please select Programming Language Status!': 'Vui lòng chọn trạng thái Ngôn ngữ Lập trình!',
                    'Programming Language Description': 'Mô tả Ngôn ngữ Lập trình',
                    'Submit': 'Gửi',
                    'Programming Languages added successfully!': 'Thêm Ngôn ngữ Lập trình thành công!',
                    'Failed to add programming languages.': 'Thêm Ngôn ngữ Lập trình thất bại.',
                    'Edit Programming Languages': 'Chỉnh sửa Ngôn ngữ Lập trình',
                    'Programming Languages updated successfully!': 'Cập nhật Ngôn ngữ Lập trình thành công!',
                    'Failed to update Programming Languages.': 'Cập nhật Ngôn ngữ Lập trình thất bại.',
                    'Tech Name': 'Tên Công nghệ',
                    'Tech Type': 'Loại Công nghệ',
                    'Tech Description': 'Mô tả Công nghệ',
                    'Tech Status': 'Trạng thái Công nghệ',
                    'Add Tech': 'Thêm Công nghệ',
                    'Edit Tech': 'Chỉnh sửa Công nghệ',
                    'Failed to fetch technologies.': 'Không thể lấy thông tin công nghệ.',
                    'Technology deleted successfully!': 'Xóa công nghệ thành công!',
                    'Failed to delete technology.': 'Không thể xóa công nghệ.',
                    'Add New Technology': 'Thêm Công nghệ Mới',
                    'Please input Tech Name!': 'Vui lòng nhập tên Công nghệ!',
                    'Please input Tech Type!': 'Vui lòng nhập loại Công nghệ!',
                    'Please select Tech Status!': 'Vui lòng chọn trạng thái Công nghệ!',
                    'Technology added successfully!': 'Thêm Công nghệ thành công!',
                    'Error adding technology:': 'Lỗi khi thêm công nghệ:',
                    'Failed to add technology.': 'Thêm Công nghệ thất bại.',
                    'Edit Technology': 'Chỉnh sửa Công nghệ',
                    'Technology updated successfully!': 'Cập nhật Công nghệ thành công!',
                    'Failed to update technology.': 'Cập nhật Công nghệ thất bại.'



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
