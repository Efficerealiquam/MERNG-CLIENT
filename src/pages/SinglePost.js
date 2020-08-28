import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import moment from "moment";
import { Grid, Image,Card,Button,Icon,Label,Form} from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import MyPopup from '../util/MyPopup'

function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const commentInputRef = useRef(null);/* es para q cuando escriba y envia un comentario ,deje de auto selecionarlo de nuevo como si fuera escribir otro comentario */

  /* Query obtener el POST */
  const {
    data: { getPost },
  } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
    onError(err) {
      console.log(err);
    },
  });

  /* Mutacion para escribir un comentario */
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCallBack() {
    props.history.push("/");
  }

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading Post...</p>;
  } else {
    const {id, body,createdAt, username, comments,likes,likeCount,commentCount,
    } = getPost;

    postMarkup = (
      <>
        <Grid>
          <Grid.Row>
            <Grid.Column width={2}>
              <Image
                src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                size="small"
                float="rigth"
              />
            </Grid.Column>
            <Grid.Column width={10}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>{username}</Card.Header>
                  <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{body}</Card.Description>
                </Card.Content>
                <hr />
                <Card.Content>
                  <LikeButton user={user} post={{ id, likeCount, likes }} />
                    <MyPopup content="Comment on Post">
                      <Button
                      as="div"
                      labelPosition="right"
                      onClick={() => console.log("Comment on Post")}
                    >
                      <Button basic color="blue">
                        <Icon name="comments" />
                      </Button>
                      <Label basic color="blue" pointing="left">
                        {commentCount}
                      </Label>
                      </Button>
                    </MyPopup>
                    {user && user.username === username && (
                      <DeleteButton postId={id} callback={deletePostCallBack} />
                    )}
                 
                </Card.Content>
              </Card>
              {/* Si hay un usuario te sale la barra de comentar */}
              {user && (
                <Card fluid>
                  <Card.Content>
                    <p>Post a comment</p>
                    <Form>
                      <div className="ui action input fluid">
                        <input
                          type="text"
                          placeholder="Comment..."
                          name="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          ref={commentInputRef} /* por el "ref" es q usamos esta ves el input , etc de manera tradicional
                          por con el semantic no tiene el "ref" */
                        />
                        <button
                          type="submit"
                          className="ui button teal"
                          disabled={comment.trim() === ""}
                          onClick={submitComment}
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  </Card.Content>
                </Card>
              )}
              {/* UN recorrido de todos los comentarios */}
              {comments.map((comment) => (
                <Card fluid key={comment.id}>
                  <Card.Content>
                    {user && user.username === comment.username && (
                      <DeleteButton postId={id} commentId={comment.id} />
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
                </Card>
              ))}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
  return postMarkup;
}
const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
