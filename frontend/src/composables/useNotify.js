import Swal from 'sweetalert2'

export const useNotify = () => {
  const notify = async (icon = "success", title = 'Success', text = '') => {
    return Swal.fire({
      title,
      text,
      icon: icon,
      background: '#fdfefb',
      color: '#0f172a',
    });
  }

  return { notify }
}
