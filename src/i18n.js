import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                "Manage Accounts": "Manage Accounts",
                "Account Info": "Account Info",
                "Reset Password": "Reset Password",
                "Manage Projects": "Manage Projects",
                "Project Info": "Project Info",
                "Assign Employees": "Assign Employees",
                "Project Tracking": "Project Tracking",
                Technology: "Technology",
                "Technology Info": "Technology Info",
                Employee: "Employee",
                "Employee Profile": "Employee Profile",
                Languages: "Languages",
                "Programming Language Info": "Programming Language Info",
                Translate: "Translate",
                Vietnamese: "Vietnamese",
                English: "English",
                CV: "CV",
                "Admin Page": "Admin Page",
                "Add User": "Add User",
                "Edit User": "Edit User",
                Email: "Email",
                Role: "Role",
                Status: "Status",
                Active: "Active",
                Inactive: "Inactive",
                "Please input your email!": "Please input your email!",
                "Please select a role!": "Please select a role!",
                "Please select a status!": "Please select a status!",
                "Update User": "Update User",
                "Current Users": "Current Users",
                Actions: "Actions",
                Delete: "Delete",
                Edit: "Edit",
                "Export to Excel": "Export to Excel",
                Logout: "Logout",
                Admin: "Admin",
                "Change Password": "Change Password",
                "Current Password": "Current Password",
                "New Password": "New Password",
                "Confirm New Password": "Confirm New Password",
                "Please input your current password!":
                    "Please input your current password!",
                "Please input your new password!": "Please input your new password!",
                "Please confirm your new password!":
                    "Please confirm your new password!",
                "New passwords do not match.": "New passwords do not match.",
                "Current password is incorrect.": "Current password is incorrect.",
                "Password changed successfully!": "Password changed successfully!",
                "Failed to change password. Please try again.":
                    "Failed to change password. Please try again.",
                Name: "Name",
                Type: "Type",
                Description: "Description",
                "Add Programming Language": "Add Programming Language",
                "Failed to fetch programmingLanguages.":
                    "Failed to fetch programmingLanguages.",
                "Programming Languages deleted successfully!":
                    "Programming Languages deleted successfully!",
                "Failed to delete Programming Languages.":
                    "Failed to delete Programming Languages.",
                "Add New Programming Language": "Add New Programming Language",
                "Programming Language Name": "Programming Language Name",
                "Please input Programming Language Name!":
                    "Please input Programming Language Name!",
                "Programming Language Type": "Programming Language Type",
                "Please input Programming Language Type!":
                    "Please input Programming Language Type!",
                "Programming Language Status": "Programming Language Status",
                "Please select Programming Language Status!":
                    "Please select Programming Language Status!",
                "Programming Language Description": "Programming Language Description",
                Submit: "Submit",
                "Programming Languages added successfully!":
                    "Programming Languages added successfully!",
                "Failed to add programming languages.":
                    "Failed to add programming languages.",
                "Edit Programming Languages": "Edit Programming Languages",
                "Programming Languages updated successfully!":
                    "Programming Languages updated successfully!",
                "Failed to update Programming Languages.":
                    "Failed to update Programming Languages.",
                "Tech Name": "Tech Name",
                "Tech Type": "Tech Type",
                "Tech Description": "Tech Description",
                "Tech Status": "Tech Status",
                "Add Tech": "Add Tech",
                "Edit Tech": "Edit Tech",
                "Failed to fetch technologies.": "Failed to fetch technologies.",
                "Technology deleted successfully!": "Technology deleted successfully!",
                "Failed to delete technology.": "Failed to delete technology.",
                "Add New Technology": "Add New Technology",
                "Please input Tech Name!": "Please input Tech Name!",
                "Please input Tech Type!": "Please input Tech Type!",
                "Please select Tech Status!": "Please select Tech Status!",
                "Technology added successfully!": "Technology added successfully!",
                "Error adding technology:": "Error adding technology:",
                "Failed to add technology.": "Failed to add technology.",
                "Edit Technology": "Edit Technology",
                "Technology updated successfully!": "Technology updated successfully!",
                "Failed to update technology.": "Failed to update technology.",
                "Please fill in all fields": "Please fill in all fields",
                "Search by email": "Search by email",
                "User updated successfully!": "User updated successfully!",
                "User added successfully!": "User added successfully!",
                "Error adding or updating user": "Error adding or updating user",
                "Cannot delete the only admin user":
                    "Cannot delete the only admin user",
                "Cannot delete an admin user": "Cannot delete an admin user",
                "User deleted successfully!": "User deleted successfully!",
                "Error deleting user": "Error deleting user",
                "Error fetching users": "Error fetching users",
                "Add Position": "Add Position",
                "Edit Position": "Edit Position",
                "Position added successfully!": "Position added successfully!",
                "Position updated successfully!": "Position updated successfully!",
                "Position deleted successfully!": "Position deleted successfully!",
                "Failed to add position.": "Failed to add position.",
                "Failed to update position.": "Failed to update position.",
                "Failed to delete position.": "Failed to delete position.",
                "Please input the name!": "Please input the name!",
                "Please input the description!": "Please input the description!",
                "Please select the status!": "Please select the status!",
                Position: "Position",
                "Projects list": "Projects list",
                "Filter by Status": "Filter by Status",
                "Search by Name": "Search by Name",
                "Not Started": "Not Started",
                Ongoing: "Ongoing",
                Completed: "Completed",
                "Create new project": "Create new project",
                "Project Details": "Project Details",
                "Programming Language": "Programming Language",
                "Start Date": "Start Date",
                "End Date": "End Date",
                "Back to Project List": "Back to Project List",
                "Project not found": "Project not found",
                "Loading...": "Loading...",
                "Edit Project": "Edit Project",
                "Please select the technologies!": "Please select the technologies",
                "Please select the programming languages!":
                    "Please select the programming languages",
                "Date Range": "Date Range",
                "Please select the date range!": "Please select the date range",
                "Update Project": "Update Project",
                "Project updated successfully": "Project updated successfully",
                "Failed to update project": "Failed to update project",
                "Tags Mode": "Tags Mode",
                Detail: "Detail",
                "Cannot delete an ongoing or pending project!":
                    "Cannot delete an ongoing or pending project!",
                "Project deleted successfully!": "Project deleted successfully!",
                "Project added successfully!": "Project added successfully!",
                "Can't delete status active": "Can't delete status active",
                "Search by Type": "Search by Type",
                "Programming Language deleted successfully!":
                    "Programming Language deleted successfully!",
                "Edit Programming Language": "Edit Programming Language",
                "Program Language Name": "Program Language Name",
                "Please input Program Language Name!":
                    "Please input Program Language Name!",
                "Program Language Type": "Program Language Type",
                "Please input Program Language Type!":
                    "Please input Program Language Type!",
                "Program Language Status": "Program Language Status",
                "Program Language Description": "Program Language Description",
                "Back to Programing Language List": "Back to Programing Language List",
                "Failed to fetch programming languages.":
                    "Failed to fetch programming languages.",
                "Programming language updated successfully!":
                    "Programming language updated successfully!",
                "Failed to update programming language.":
                    "Failed to update programming language.",
                Pending: "Pending",
                Projects: "Projects",
                "Add Employee": "Add Employee",
                ID: "ID",
                Phone: "Phone",
                Skills: "Skills",
                Contact: "Contact",
                "CV Skill": "CV Skill",
                "Work Position": "Work Position",
                "Time Work": "Time Work",
                "CV File": "CV File",
                active: "active",
                inactive: "inactive",
                "Please input the email!": "Please input the email!",
                "Please input the phone number!": "Please input the phone number!",
                "Please select the position!": "Please select the position!",
                "Project IDs": "Project IDs",
                "Please input the project IDs!": "Please input the project IDs!",
                "Please input the skills!": "Please input the skills!",
                "Please input the contact!": "Please input the contact!",
                "Please input the CV skill!": "Please input the CV skill!",
                "Please input the work position!": "Please input the work position!",
                "Please input the time work!": "Please input the time work!",
                "CV Upload": "CV Upload",
                "Please upload a CV file!": "Please upload a CV file!",
                "Click to Upload CV": "Click to Upload CV",
                Back: "Back",
                "Employee added successfully": "Employee added successfully",
                "Error adding employee": "Error adding employee",
                "Update Employee": "Update Employee",
                "Upload CV": "Upload CV",
                "Employee Details": "Employee Details",
                "Export CV": "Export CV",
                Return: "Return",
                "Profile Page": "Profile Page",
                "User data not found": "User data not found",
                "User not authenticated": "User not authenticated",
                "Error fetching user data": "Error fetching user data",
                "Profile updated successfully": "Profile updated successfully",
                "Error updating profile": "Error updating profile",
                "No file selected": "No file selected",
                "Error uploading profile picture": "Error uploading profile picture",
                "Profile picture updated successfully":
                    "Profile picture updated successfully",
                "Please input your name!": "Please input your name!",
                "Please input your phone!": "Please input your phone!",
                Address: "Address",
                "Please input your address!": "Please input your address!",
                "Work Experience": "Work Experience",
                "Please input your work experience!":
                    "Please input your work experience!",
                Education: "Education",
                "Please input your education!": "Please input your education!",
                "Update Profile": "Update Profile",
                "Please input your skills!": "Please input your skills!",
                "No picture to upload": "No picture to upload",
                "You can only upload JPG/PNG files!":
                    "You can only upload JPG/PNG files!",
                "Back to Details": "Back to Details",
                "Profile Edit": "Profile Edit",
                "Change Picture": "Change Picture",
                "Edit Profile": "Edit Profile",
                "Profile Detail": "Profile Detail",
                "Confirm Upload": "Confirm Upload",
                Profile: "Profile",
                "Assign Project": "Assign Project",
                "Project Manager": "Project Manager",
                "Please input the project names!": "Please input the project names!",
                "Cannot delete an active employee.":
                    "Cannot delete an active employee.",
                "Employee deleted!": "Employee deleted!",
                "Employee not found.": "Employee not found.",
                "Error deleting employee: ": "Error deleting employee: ",
                "Employee Name": "Employee Name",
                "Cannot delete an active position.":
                    "Cannot delete an active position.",
                "Export to PDF": "Export to PDF",
                "Back to Programming Language List":
                    "Back to Programming Language List",
                "Employee assigned successfully!": "Employee assigned successfully!",
                "Assign Employee to Project": "Assign Employee to Project",
                "Please select a project!": "Please select a project!",
                "Assigned Employees": "Assigned Employees",
                "No employees assigned": "No employees assigned",
                "Assign Employee": "Assign Employee",
                "Unassign Employee": "Unassign Employee",
                "Please select an employee!": "Please select an employee!",
                "Select an employee": "Select an employee",
                Assign: "Assign",
                "Unassign Employee from Project": "Unassign Employee from Project",
                Unassign: "Unassign",
                "Employee unassigned successfully!":
                    "Employee unassigned successfully!",
                "Employee is already assigned to this project!":
                    "Employee is already assigned to this project!",
                Involved: "Involved",
                Available: "Available",
                Technologies: "Technologies",
                "Languages and Framework": "Languages and Framework",
                Specification: "Specification",
                "Project Name": "Project Name",
                "Move to Bin": "Move to Bin",
                "Add Technology": "Add Technology",
                Images: "Images",
                "Join a Project": "Join a Project",
                Join: "Join",
                "Admin Profile": "Admin Profile",
                "Employee List": "Employee List",
                'No end date yet': 'No end date yet',
                'Change Profile Picture': 'Change Profile Picture',
                'Profile Picture': 'Profile Picture',
                'Profile updated successfully!': 'Profile updated successfully!',
                'Project successfully restored!': 'Project successfully restored!',
                'Project permanently deleted!': 'Project permanently deleted!',
                'Project moved to bin successfully!': 'Project moved to bin successfully!',
                'Failed to move project to bin!': 'Failed to move project to bin!',
                'Project Bin': 'Project Bin',
                'Restore': 'Restore',
                'Create Account': 'Create Account',
                'View Bin': 'View Bin',
                'The first letter of the email cannot be capitalized': 'The first letter of the email cannot be capitalized',
                'End date cannot be before start date!': 'End date cannot be before start date!',
                'Phone number must have 10 numbers': 'Phone number must have 10 numbers',
                'Export to Excel filter by Email': 'Export to Excel by Email',
                'Export to Excel filter by Position': 'Export to Excel filter by Position',
                'Back to List': 'Back to List',
                'Programming Language moved to bin successfully!': 'Programming Language moved to bin successfully!',
                'Programming Language restored successfully!': 'Programming Language restored successfully!',
                'Programming Language permanently deleted!': 'Programming Language deleted permanently!',
                'Back to Language List': 'Back to Language List',
                'Please select the project duration!': 'Please select the project duration!',
                'Project Duration': 'Project Duration',
            },
        },
        vi: {
            translation: {
                "Manage Accounts": "Quản lý Tài khoản",
                "Account Info": "Thông tin Tài khoản",
                "Reset Password": "Đặt lại Mật khẩu",
                "Manage Projects": "Quản lý Dự án",
                "Project Info": "Thông tin Dự án",
                "Assign Employees": "Phân công Nhân viên",
                "Project Tracking": "Theo dõi Dự án",
                Technology: "Công nghệ",
                "Technology Info": "Thông tin Công nghệ",
                Employee: "Nhân viên",
                "Employee Profile": "Hồ sơ Nhân viên",
                Languages: "Ngôn ngữ",
                "Programming Language Info": "Thông tin Ngôn ngữ Lập trình",
                Translate: "Dịch",
                Vietnamese: "Tiếng Việt",
                English: "Tiếng Anh",
                CV: "Sơ yếu lý lịch",
                "Admin Page": "Trang Quản trị",
                "Add User": "Thêm người dùng",
                "Edit User": "Chỉnh sửa người dùng",
                Email: "Email",
                Role: "Vai trò",
                Status: "Trạng thái",
                Active: "Hoạt động",
                Inactive: "Không hoạt động",
                "Please input your email!": "Vui lòng nhập email của bạn!",
                "Please select a role!": "Vui lòng chọn vai trò!",
                "Please select a status!": "Vui lòng chọn trạng thái!",
                "Update User": "Cập nhật người dùng",
                "Current Users": "Người dùng hiện tại",
                Actions: "Hành động",
                Delete: "Xóa",
                Edit: "Chỉnh sửa",
                "Export to Excel": "Xuất ra Excel",
                Logout: "Đăng xuất",
                Admin: "Quản trị viên",
                "Change Password": "Đổi mật khẩu",
                "Current Password": "Mật khẩu hiện tại",
                "New Password": "Mật khẩu mới",
                "Confirm New Password": "Xác nhận mật khẩu mới",
                "Please input your current password!":
                    "Vui lòng nhập mật khẩu hiện tại của bạn!",
                "Please input your new password!":
                    "Vui lòng nhập mật khẩu mới của bạn!",
                "Please confirm your new password!":
                    "Vui lòng xác nhận mật khẩu mới của bạn!",
                "New passwords do not match.": "Mật khẩu mới không khớp.",
                "Current password is incorrect.": "Mật khẩu hiện tại không đúng.",
                "Password changed successfully!": "Đổi mật khẩu thành công!",
                "Failed to change password. Please try again.":
                    "Đổi mật khẩu thất bại. Vui lòng thử lại.",
                Name: "Tên",
                Type: "Loại",
                Description: "Mô tả",
                "Add Programming Language": "Thêm Ngôn ngữ Lập trình",
                "Failed to fetch programmingLanguages.":
                    "Không thể lấy thông tin ngôn ngữ lập trình.",
                "Programming Languages deleted successfully!":
                    "Xóa ngôn ngữ lập trình thành công!",
                "Failed to delete Programming Languages.":
                    "Không thể xóa ngôn ngữ lập trình.",
                "Add New Programming Language": "Thêm Ngôn ngữ Lập trình Mới",
                "Programming Language Name": "Tên Ngôn ngữ Lập trình",
                "Please input Programming Language Name!":
                    "Vui lòng nhập tên Ngôn ngữ Lập trình!",
                "Programming Language Type": "Loại Ngôn ngữ Lập trình",
                "Please input Programming Language Type!":
                    "Vui lòng nhập loại Ngôn ngữ Lập trình!",
                "Programming Language Status": "Trạng thái Ngôn ngữ Lập trình",
                "Please select Programming Language Status!":
                    "Vui lòng chọn trạng thái Ngôn ngữ Lập trình!",
                "Programming Language Description": "Mô tả Ngôn ngữ Lập trình",
                Submit: "Gửi",
                "Programming Languages added successfully!":
                    "Thêm Ngôn ngữ Lập trình thành công!",
                "Failed to add programming languages.":
                    "Thêm Ngôn ngữ Lập trình thất bại.",
                "Edit Programming Languages": "Chỉnh sửa Ngôn ngữ Lập trình",
                "Programming Languages updated successfully!":
                    "Cập nhật Ngôn ngữ Lập trình thành công!",
                "Failed to update Programming Languages.":
                    "Cập nhật Ngôn ngữ Lập trình thất bại.",
                "Tech Name": "Tên Công nghệ",
                "Tech Type": "Loại Công nghệ",
                "Tech Description": "Mô tả Công nghệ",
                "Tech Status": "Trạng thái Công nghệ",
                "Add Tech": "Thêm Công nghệ",
                "Edit Tech": "Chỉnh sửa Công nghệ",
                "Failed to fetch technologies.": "Không thể lấy thông tin công nghệ.",
                "Technology deleted successfully!": "Xóa công nghệ thành công!",
                "Failed to delete technology.": "Không thể xóa công nghệ.",
                "Add New Technology": "Thêm Công nghệ Mới",
                "Please input Tech Name!": "Vui lòng nhập tên Công nghệ!",
                "Please input Tech Type!": "Vui lòng nhập loại Công nghệ!",
                "Please select Tech Status!": "Vui lòng chọn trạng thái Công nghệ!",
                "Technology added successfully!": "Thêm Công nghệ thành công!",
                "Error adding technology:": "Lỗi khi thêm công nghệ:",
                "Failed to add technology.": "Thêm Công nghệ thất bại.",
                "Edit Technology": "Chỉnh sửa Công nghệ",
                "Technology updated successfully!": "Cập nhật Công nghệ thành công!",
                "Failed to update technology.": "Cập nhật Công nghệ thất bại.",
                "Please fill in all fields": "Vui lòng điền vào tất cả các trường",
                "Search by email": "Tìm kiếm theo email",
                "User updated successfully!": "Cập nhật người dùng thành công!",
                "User added successfully!": "Thêm người dùng thành công!",
                "Error adding or updating user":
                    "Lỗi khi thêm hoặc cập nhật người dùng",
                "Cannot delete the only admin user":
                    "Không thể xóa người quản trị duy nhất",
                "Cannot delete an admin user": "Không thể xóa người quản trị",
                "User deleted successfully!": "Xóa người dùng thành công!",
                "Error deleting user": "Lỗi khi xóa người dùng",
                "Error fetching users": "Lỗi khi lấy thông tin người dùng",
                "Add Position": "Thêm Vị trí",
                "Edit Position": "Chỉnh sửa Vị trí",
                "Position added successfully!": "Thêm Vị trí thành công!",
                "Position updated successfully!": "Cập nhật Vị trí thành công!",
                "Position deleted successfully!": "Xóa Vị trí thành công!",
                "Failed to add position.": "Thêm Vị trí thất bại.",
                "Failed to update position.": "Cập nhật Vị trí thất bại.",
                "Failed to delete position.": "Xóa Vị trí thất bại.",
                "Please input the name!": "Vui lòng nhập tên!",
                "Please input the description!": "Vui lòng nhập mô tả!",
                "Please select the status!": "Vui lòng chọn trạng thái!",
                Position: "Vị Trí",
                "Projects list": "Danh sách dự án",
                "Filter by Status": "Lọc theo Trạng thái",
                "Search by Name": "Tìm kiếm theo Tên",
                "Not Started": "Chưa Bắt Đầu",
                Ongoing: "Đang Tiến Hành",
                Completed: "Hoàn Thành",
                "Create new project": "Tạo dự án mới",
                "Project Details": "Chi tiết Dự án",
                "Programming Language": "Ngôn ngữ Lập trình",
                "Start Date": "Ngày bắt đầu",
                "End Date": "Ngày kết thúc",
                "Back to Project List": "Trở lại Danh sách Dự án",
                "Project not found": "Không tìm thấy Dự án",
                "Loading...": "Đang tải...",
                "Edit Project": "Chỉnh sửa Dự án",
                "Please select the technologies!": "Vui lòng chọn các công nghệ",
                "Please select the programming languages!":
                    "Vui lòng chọn các ngôn ngữ lập trình",
                "Date Range": "Khoảng thời gian",
                "Please select the date range!": "Vui lòng chọn khoảng thời gian",
                "Update Project": "Cập nhật Dự án",
                "Project updated successfully": "Cập nhật Dự án thành công",
                "Failed to update project": "Cập nhật Dự án thất bại",
                "Tags Mode": "Chế độ Tags",
                Detail: "Chi tiết",
                "Cannot delete an ongoing or pending project!":
                    "Không thể xóa dự án đang diễn ra hoặc đang chờ xử lý!",
                "Project deleted successfully!": "Xóa dự án thành công!",
                "Project added successfully!": "Thêm dự án thành công!",
                "Can't delete status active": "Không thể xóa trạng thái đang hoạt động",
                "Search by Type": "Tìm kiếm theo Loại",
                "Programming Language deleted successfully!":
                    "Ngôn ngữ lập trình đã được xóa thành công!",
                "Edit Programming Language": "Chỉnh sửa Ngôn ngữ Lập trình",
                "Program Language Name": "Tên Ngôn ngữ Lập trình",
                "Please input Program Language Name!":
                    "Vui lòng nhập Tên Ngôn ngữ Lập trình!",
                "Program Language Type": "Loại Ngôn ngữ Lập trình",
                "Please input Program Language Type!":
                    "Vui lòng nhập Loại Ngôn ngữ Lập trình!",
                "Program Language Description": "Mô tả Ngôn ngữ Lập trình",
                "Back to Programing Language List":
                    "Trở lại Danh sách Ngôn ngữ Lập trình",
                "Failed to fetch programming languages.":
                    "Không thể lấy thông tin ngôn ngữ lập trình.",
                "Programming language updated successfully!":
                    "Cập nhật ngôn ngữ lập trình thành công!",
                "Failed to update programming language.":
                    "Cập nhật ngôn ngữ lập trình thất bại.",
                "Program Language Status": "Trạng thái ngôn ngữ lập trình",
                Pending: "Đang chờ xử lý",
                Projects: "Dự án",
                "Add Employee": "Thêm nhân viên",
                ID: "ID",
                Phone: "Điện thoại",
                Skills: "Kỹ năng",
                Contact: "Liên hệ",
                "CV Skill": "Kỹ năng CV",
                "Work Position": "Vị trí công việc",
                "Time Work": "Thời gian làm việc",
                "CV File": "File CV",
                active: "Hoạt động",
                inactive: "Không hoạt động",
                "Please input the email!": "Vui lòng nhập email!",
                "Please input the phone number!": "Vui lòng nhập số điện thoại!",
                "Please select the position!": "Vui lòng chọn vị trí!",
                "Project IDs": "Mã dự án",
                "Please input the project IDs!": "Vui lòng nhập mã dự án!",
                "Please input the skills!": "Vui lòng nhập kỹ năng!",
                "Please input the contact!": "Vui lòng nhập thông tin liên hệ!",
                "Please input the CV skill!": "Vui lòng nhập kỹ năng CV!",
                "Please input the work position!": "Vui lòng nhập vị trí công việc!",
                "Please input the time work!": "Vui lòng nhập thời gian làm việc!",
                "CV Upload": "Tải lên CV",
                "Please upload a CV file!": "Vui lòng tải lên tệp CV!",
                "Click to Upload CV": "Nhấn để tải lên CV",
                Back: "Quay lại",
                "Employee added successfully": "Thêm nhân viên thành công",
                "Error adding employee": "Lỗi khi thêm nhân viên",
                "Update Employee": "Cập nhật nhân viên",
                "Upload CV": "Tải lên CV",
                "Employee Details": "Chi tiết nhân viên",
                "Export CV": "Xuất CV",
                Return: "Trở về",
                "Profile Page": "Trang Cá Nhân",
                "User data not found": "Không tìm thấy dữ liệu người dùng",
                "User not authenticated": "Người dùng chưa được xác thực",
                "Error fetching user data": "Lỗi khi lấy dữ liệu người dùng",
                "Profile updated successfully": "Cập nhật hồ sơ thành công",
                "Error updating profile": "Lỗi khi cập nhật hồ sơ",
                "No file selected": "Chưa chọn tệp",
                "Error uploading profile picture": "Lỗi khi tải lên ảnh hồ sơ",
                "Profile picture updated successfully": "Cập nhật ảnh hồ sơ thành công",
                "Please input your name!": "Vui lòng nhập tên của bạn!",
                "Please input your phone!": "Vui lòng nhập số điện thoại của bạn!",
                Address: "Địa chỉ",
                "Please input your address!": "Vui lòng nhập địa chỉ của bạn!",
                "Work Experience": "Kinh nghiệm làm việc",
                "Please input your work experience!":
                    "Vui lòng nhập kinh nghiệm làm việc của bạn!",
                Education: "Học vấn",
                "Please input your education!": "Vui lòng nhập học vấn của bạn!",
                "Update Profile": "Cập nhật Hồ sơ",
                "Please input your skills!": "Hãy nhập kỹ năng của bạn!",
                "No picture to upload": "Không có hình ảnh để tải lên",
                "You can only upload JPG/PNG files!":
                    "Bạn chỉ có thể tải lên tệp JPG/PNG!",
                "Back to Details": "Quay lại chi tiết",
                "Profile Edit": "Chỉnh sửa hồ sơ",
                "Change Picture": "Thay đổi hình ảnh",
                "Profile Detail": "Chi tiết hồ sơ",
                "Edit Profile": "Chỉnh sửa hồ sơ",
                "Confirm Upload": "Xác nhận tải lên",
                Profile: "Hồ sơ",
                "Assign Project": "Phân công Dự án",
                "Project Manager": "Quản lý dự án",
                "Please input the project names!": "Vui lòng nhập tên dự án!",
                "Cannot delete an active employee.":
                    "Không thể xóa nhân viên đang hoạt động.",
                "Employee deleted!": "Nhân viên đã được xóa!",
                "Employee not found.": "Không tìm thấy nhân viên.",
                "Error deleting employee: ": "Lỗi khi xóa nhân viên: ",
                "Employee Name": "Tên Nhân viên",
                "Cannot delete an active position.":
                    "Không thể xóa vị trí đang hoạt động.",
                "Export to PDF": "Xuất ra PDF",
                "Back to Programming Language List":
                    "Quay lại danh sách ngôn ngữ lập trình",
                "Employee assigned successfully!":
                    "Nhân viên đã được phân công thành công!",
                "Assign Employee to Project": "Chỉ định nhân viên cho dự án",
                "Please select a project!": "Vui lòng chọn một dự án!",
                "Assigned Employees": "Nhân viên đã được phân công",
                "No employees assigned": "Không có nhân viên nào được chỉ định",
                "Assign Employee": "Chỉ định nhân viên",
                "Unassign Employee": "Bỏ phân công nhân viên",
                "Please select an employee!": "Vui lòng chọn một nhân viên!",
                "Select an employee": "Chọn một nhân viên",
                Assign: "Giao",
                "Unassign Employee from Project": "Bỏ phân công nhân viên khỏi dự án",
                Unassign: "Bỏ giao",
                "Employee unassigned successfully!":
                    "Đã hủy phân công nhân viên thành công!",
                "Employee is already assigned to this project!":
                    "Nhân viên đã được phân công vào dự án này!",
                Involved: "tham gia",
                Available: "sẵn sàng",
                Technologies: "Công nghệ",
                "Languages and Framework": "Ngôn ngữ và Khung phần mềm",
                Specification: "Sự chỉ rõ",
                "Project Name": "Tên dự án",
                "Move to Bin": "Chuyển đến Thùng rác",
                "Add Technology": "Thêm Công nghệ",
                Images: "hình ảnh",
                "Join a Project": "Tham gia một dự án",
                Join: "Tham gia",
                "Admin Profile": "Hồ sơ quản trị",
                "Employee List": "Danh sách nhân viên",
                'No end date yet': 'Chưa có ngày kết thúc',
                'Change Profile Picture': 'Thay đổi ảnh đại diện',
                'Profile Picture': 'Ảnh đại diện',
                'Profile updated successfully!': 'Hô sơ được cập nhật thành công!',
                'Project successfully restored!': 'Dự án đã được khôi phục thành công!',
                'Project permanently deleted!': 'Dự án đã bị xóa vĩnh viễn!',
                'Project moved to bin successfully!': 'Dự án đã được chuyển vào thùng rác thành công!',
                'Project Bin': 'Thùng rác dự án',
                'Restore': 'Khôi phục',
                'Create Account': 'Tạo tài khoản',
                'View Bin': 'Xem thùng rác',
                'The first letter of the email cannot be capitalized': 'Chữ cái đầu tiên của email không được viết hoa',
                'End date cannot be before start date!': 'Ngày kết thúc không thể trước ngày bắt đầu!',
                'Phone number must have 10 numbers': 'Số điện thoại phải có 10 số',
                'Export to Excel filter by Email': 'Xuất sang Excel lọc theo Email',
                'Export to Excel filter by Position': 'Xuất sang Excel lọc theo Vị trí',
                'Back to List': 'Quay lại danh sách',
                'Programming Language moved to bin successfully!': 'Ngôn ngữ lập trình đã được chuyển vào thùng rác thành công!',
                'Programming Language restored successfully!': 'Ngôn ngữ lập trình đã được khôi phục thành công!',
                'Programming Language permanently deleted!': 'Ngôn ngữ lập trình đã bị xóa vĩnh viễn!',
                'Back to Language List': 'Quay lại danh sách ngôn ngữ',
                'Please select the project duration!': 'Vui lòng chọn thời gian thực hiện dự án!',
                'Project Duration': 'Thời gian dự án',
            },
        },
    },
    lng: "en", // Ngôn ngữ mặc định
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
