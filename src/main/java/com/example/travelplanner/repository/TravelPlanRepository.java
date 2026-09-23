package com.example.travelplanner.repository;

import com.example.travelplanner.model.TravelPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TravelPlanRepository extends MongoRepository<TravelPlan, String> {

    List<TravelPlan> findAllByOrderByIdDesc();
}

