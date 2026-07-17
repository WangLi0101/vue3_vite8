import { ElMessage } from "element-plus";

export const showErrorToast = (message: string): void => {
  ElMessage.error({
    message,
    duration: 3000,
    grouping: true,
  });
};
