import { Modal } from 'antd';

const { confirm } = Modal;

function showConfirm({ title, icon, content, handleOk, handleCancel }) {
  confirm({
    title: title,
    icon: icon,
    content: content,
    onOk: handleOk,
    onCancel: handleCancel,
  });
}

export default showConfirm;
