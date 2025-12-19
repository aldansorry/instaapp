import Swal from 'sweetalert2'

export const useConfirm = () => {
  const confirm = async (title = 'Konfirmasi', text = 'Lanjutkan tindakan ini?') => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#ef4444',
      background: '#fdfefb',
      color: '#0f172a',
    }).then((r) => r.isConfirmed)
  }

  const confirmDeletePost = () => confirm(
      'Delete this post?',
      'Are you sure you want to delete this post? This action cannot be undone.'
    )

  const confirmDeleteComment = () => confirm(
      'Delete this comment?',
      'Are you sure you want to delete this comment? This action cannot be undone.'
    )

  return { confirm, confirmDeletePost, confirmDeleteComment }
}
