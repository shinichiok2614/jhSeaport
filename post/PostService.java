package com.mycompany.myapp.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mycompany.myapp.domain.Post;
import com.mycompany.myapp.repository.PostRepository;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Transactional(readOnly = true)
    public List<Post> findAllByPersonId(Long personId) {
        return postRepository.findAllByPersonId(personId);
    }
}