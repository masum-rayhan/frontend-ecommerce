import { withAdminAuth } from '../../../HOC'

 const AuthTestAdmin = () => {
  return (
    <div>This page can only be accessed if role of logged in user is ADMIN</div>
  )
}

export default withAdminAuth(AuthTestAdmin);
