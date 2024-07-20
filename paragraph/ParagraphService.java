package com.mycompany.myapp.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mycompany.myapp.domain.Paragraph;
import com.mycompany.myapp.repository.ParagraphRepository;

@Service
@Transactional
public class ParagraphService {
    private final ParagraphRepository paragraphRepository;

    public ParagraphService(ParagraphRepository paragraphRepository) {
        this.paragraphRepository = paragraphRepository;
    }
    @Transactional(readOnly = true)
    public List<Paragraph> findAllByPostId(Long postId) {
        return paragraphRepository.findAllByPostId(postId);
    }
}
