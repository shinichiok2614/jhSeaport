package com.mycompany.myapp.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mycompany.myapp.domain.Image;
import com.mycompany.myapp.repository.ImageRepository;

@Service
@Transactional
public class ImageService {
    private final ImageRepository imageRepository;

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }
    @Transactional(readOnly = true)
    public List<Image> findAllByParagraphId(Long postId) {
        return imageRepository.findAllByParagraphId(postId);
    }
}
