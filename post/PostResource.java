package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Post;
import com.mycompany.myapp.repository.PostRepository;
import com.mycompany.myapp.service.PostService;
import com.mycompany.myapp.service.dto.PostDetailDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Post}.
 */
@RestController
@RequestMapping("/api/posts")
@Transactional
public class PostResource {

    private static final Logger log = LoggerFactory.getLogger(PostResource.class);

    private static final String ENTITY_NAME = "post";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PostRepository postRepository;
    private final PostService postService;

    public PostResource(PostRepository postRepository, PostService postService) {
        this.postRepository = postRepository;
        this.postService = postService;
    }

    /**
     * {@code POST  /posts} : Create a new post.
     *
     * @param post the post to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new post, or with status {@code 400 (Bad Request)} if the
     *         post has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Post> createPost(@Valid @RequestBody Post post) throws URISyntaxException {
        log.debug("REST request to save Post : {}", post);
        if (post.getId() != null) {
            throw new BadRequestAlertException("A new post cannot already have an ID", ENTITY_NAME, "idexists");
        }
        post = postRepository.save(post);
        return ResponseEntity.created(new URI("/api/posts/" + post.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
                        post.getId().toString()))
                .body(post);
    }

    /**
     * {@code PUT  /posts/:id} : Updates an existing post.
     *
     * @param id   the id of the post to save.
     * @param post the post to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated post,
     *         or with status {@code 400 (Bad Request)} if the post is not valid,
     *         or with status {@code 500 (Internal Server Error)} if the post
     *         couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable(value = "id", required = false) final Long id,
            @Valid @RequestBody Post post)
            throws URISyntaxException {
        log.debug("REST request to update Post : {}, {}", id, post);
        if (post.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, post.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!postRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        post = postRepository.save(post);
        return ResponseEntity.ok()
                .headers(
                        HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, post.getId().toString()))
                .body(post);
    }

    /**
     * {@code PATCH  /posts/:id} : Partial updates given fields of an existing post,
     * field will ignore if it is null
     *
     * @param id   the id of the post to save.
     * @param post the post to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated post,
     *         or with status {@code 400 (Bad Request)} if the post is not valid,
     *         or with status {@code 404 (Not Found)} if the post is not found,
     *         or with status {@code 500 (Internal Server Error)} if the post
     *         couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Post> partialUpdatePost(
            @PathVariable(value = "id", required = false) final Long id,
            @NotNull @RequestBody Post post) throws URISyntaxException {
        log.debug("REST request to partial update Post partially : {}, {}", id, post);
        if (post.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, post.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!postRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Post> result = postRepository
                .findById(post.getId())
                .map(existingPost -> {
                    if (post.getName() != null) {
                        existingPost.setName(post.getName());
                    }
                    if (post.getCreatedAt() != null) {
                        existingPost.setCreatedAt(post.getCreatedAt());
                    }
                    if (post.getUpdateAt() != null) {
                        existingPost.setUpdateAt(post.getUpdateAt());
                    }
                    if (post.getStatus() != null) {
                        existingPost.setStatus(post.getStatus());
                    }
                    if (post.getView() != null) {
                        existingPost.setView(post.getView());
                    }

                    return existingPost;
                })
                .map(postRepository::save);

        return ResponseUtil.wrapOrNotFound(
                result,
                HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, post.getId().toString()));
    }

    /**
     * {@code GET  /posts} : get all the posts.
     *
     * @param eagerload flag to eager load entities from relationships (This is
     *                  applicable for many-to-many).
     * @param filter    the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of posts in body.
     */
    @GetMapping("")
    public List<Post> getAllPosts(
            @RequestParam(name = "filter", required = false) String filter,
            @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        if ("album-is-null".equals(filter)) {
            log.debug("REST request to get all Posts where album is null");
            return StreamSupport.stream(postRepository.findAll().spliterator(), false)
                    .filter(post -> post.getAlbum() == null).toList();
        }

        if ("commentlist-is-null".equals(filter)) {
            log.debug("REST request to get all Posts where commentList is null");
            return StreamSupport.stream(postRepository.findAll().spliterator(), false)
                    .filter(post -> post.getCommentList() == null)
                    .toList();
        }
        log.debug("REST request to get all Posts");
        if (eagerload) {
            return postRepository.findAllWithEagerRelationships();
        } else {
            return postRepository.findAll();
        }
    }

    /**
     * {@code GET  /posts/:id} : get the "id" post.
     *
     * @param id the id of the post to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the post, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable("id") Long id) {
        log.debug("REST request to get Post : {}", id);
        Optional<Post> post = postRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(post);
    }

    /**
     * {@code DELETE  /posts/:id} : delete the "id" post.
     *
     * @param id the id of the post to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable("id") Long id) {
        log.debug("REST request to delete Post : {}", id);
        postRepository.deleteById(id);
        return ResponseEntity.noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .build();
    }

    @GetMapping("/by-person/{personId}")
    public ResponseEntity<List<Post>> getAllPostsByPersonId(@PathVariable Long personId) {
        List<Post> posts = postService.findAllByPersonId(personId);
        return ResponseEntity.ok().body(posts);
    }

    @PutMapping("/{id}/increaseView")
    public ResponseEntity<Post> increaseView(@PathVariable Long id) {
        log.debug("REST request to increase view count for Post : {}", id);
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            post.setView(post.getView() + 1);
            postRepository.save(post);
            return ResponseEntity.ok().body(post);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/allpost")
    public ResponseEntity<List<PostDetailDTO>> getAllPostDetails() {
        List<PostDetailDTO> postDetail = postService.getAllPostDetails();
        return ResponseEntity.ok(postDetail);
    }
}
