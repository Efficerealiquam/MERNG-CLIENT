import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { FETCH_POSTS_QUERY } from '../util/graphql';
import { Grid, Transition } from 'semantic-ui-react'
import PostCard from '../components/PostCard'
import { AuthContext } from '../context/auth'
import PostForm from '../components/PostForm'
function Home() {
    /* destructuramos de esta forma en esta version de @apollo/react-hooks */
    let posts = ''
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);
    if (data) {
        posts = { data: data.getPosts }
    }
    const { user } = useContext(AuthContext);
    return (

        <Grid columns={3} >
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm />
                    </Grid.Column>
                )}
                {loading ? (
                    <h1>Loading Posts...</h1>
                ) : (
                        <Transition.Group>
                            {posts.data && posts.data.map(post => (
                                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                                    <PostCard post={post} />
                                </Grid.Column>
                            ))}
                        </Transition.Group>
                    )}
            </Grid.Row>
        </Grid>

    )
}

export default Home;