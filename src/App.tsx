import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'

import { Navbar } from './app/Navbar'
import { NotificationsList } from './features/notifications/notifications-list'
import { AddPostForm } from './features/posts/add-post-form'
import { EditPostForm } from './features/posts/edit-post-form'
import { PostsList } from './features/posts/posts-list'
import { SinglePostPage } from './features/posts/single-post-page'
import { UserPage } from './features/users/user-page'
import { UsersList } from './features/users/users-list'

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Switch>
          <Route exact path="/notifications" component={NotificationsList} />

          <Route
            exact
            path="/"
            render={() => (
              <>
                <AddPostForm />
                <PostsList />
              </>
            )}
          />

          <Route exact path="/posts/:postId" component={SinglePostPage} />
          <Route exact path="/editPost/:postId" component={EditPostForm} />
          <Route exact path="/users" component={UsersList} />
          <Route exact path="/users/:userId" component={UserPage} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
