package com.github.holly.accountability.tasks;
import com.github.holly.accountability.relationships.RelationshipService;
import com.github.holly.accountability.user.UserService;
import com.github.holly.accountability.wallet.WalletService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Component
public class TaskService {

    private final TaskRepository taskRepository;

    private final WalletService walletService;
    private final UserService userService;
    private final RelationshipService relationshipService;

    public static final double MINUTES_IN_HOUR = 60;
    public static final double GERMAN_MINIMUM_WAGE = 13;

    public TaskService(TaskRepository taskRepository,
                       WalletService walletService,
                       UserService userService,
                       RelationshipService relationshipService
    ){
        this.taskRepository = taskRepository;
        this.walletService = walletService;
        this.userService = userService;
        this.relationshipService = relationshipService;
    }

    public Double calculateFromTaskDto(TaskData taskDto){
        Duration time = taskDto.getDuration();
        //to avoid floating point error, multiply first
        double beforeHourDivision = time.toMinutes() * GERMAN_MINIMUM_WAGE;
        return beforeHourDivision/MINUTES_IN_HOUR;
    }

    public boolean startOrEndTask(Task task, String action){

        if (action.equals("start")) {
            if (task.getTimeStart() != null) {
                return false;
            }
            task.setTimeStart(LocalDateTime.now());
            task.setStatus(TaskStatus.IN_PROGRESS);
            taskRepository.save(task);
            return true;
        }

        if (action.equals("end")) {
            if (task.getTimeEnd() != null) {
                return false;
            }
            task.setTimeEnd(LocalDateTime.now());
            task.setStatus(TaskStatus.COMPLETED);
            taskRepository.save(task);
            return true;
        }

        return false;
    }

    public TaskCalculator getWageFromSeconds(TaskStatus status, Long currentUserId){
        Double taskInSeconds = null;

        if (status == TaskStatus.COMPLETED){
            taskInSeconds = taskRepository
                    .getTotalSecondsWithEndTime(currentUserId, TaskStatus.COMPLETED);
        }

        if (status == TaskStatus.IN_PROGRESS){
            taskInSeconds = taskRepository
                    .getTotalSecondsNoEndTime(currentUserId, TaskStatus.IN_PROGRESS);
        }

        TaskCalculator taskCalculator = new TaskCalculator();

        if (taskInSeconds != null) {
            double earnings = taskInSeconds*13;
            earnings = earnings/3600;
            taskCalculator.setPayment(earnings);
        }

        return taskCalculator;
    }

    public Task checkIfValidTaskProcess(Long currentUserId,
                                           Long taskId,
                                           TaskStatusDto newStatus){

        Task task = taskRepository.findById(taskId).orElse(null);

        if (task == null) {
            return null;
        }

        if(!relationshipService.checkIfApprovedPartnership(currentUserId, task.getUser().getId())){
            return null;
        }

        if (!task.getStatus().equals(TaskStatus.COMPLETED)) {
            return null;
        }

        if (newStatus.getStatus() == TaskStatus.REJECTED ||
                newStatus.getStatus() == TaskStatus.APPROVED) {
            task.setStatus(newStatus.getStatus());
            taskRepository.save(task);
        }

        return task;
    }

    public void addTaskAsPayment(Long currentUserId, TaskData taskDto){
        Double payment = calculateFromTaskDto(taskDto);
        walletService.addTaskToWallet(currentUserId, payment);
    }

    public Page<Task> getRelevantTasks(List<Long> userIds,
                                           List<TaskStatus> statuses,
                                           Pageable pageable,
                                           Long currentUserId
    ){
        if (userIds == null) {
            return taskRepository.findByUserId(currentUserId, statuses, pageable);
        }

        return taskRepository.findByUserIdIn(userIds, statuses, pageable);
    }

    public Page<Task> getTasksByDuration(List<Long> userIds,
                                             TaskStatus status,
                                             Pageable pageable,
                                             Long currentUserId
    ){
        return taskRepository
                .getTasksOrderByDurationFindByUserIdAndStatus(
                        Objects.requireNonNullElseGet(userIds, () ->
                                List.of(currentUserId)),
                        status, pageable
                );
    }

    public Task addNewTask(TaskEditRequest request, Long currentUserId){
        Task newTask = new Task();

        newTask.setDescription(request.getDescription());
        newTask.setUser(userService.findUserById(currentUserId));
        taskRepository.save(newTask);

        return newTask;
    }

    public Task validateUserTask(Long taskId, Long userId){
        Task task = taskRepository
                .findById(taskId)
                .orElse(null);

        if (task != null) {
            if (task.getUser().getId().equals(userId)) {
                return task;
            }
        }

        return null;
    }

    public boolean deleteTask(Long taskId, Long userId){
        Task task = validateUserTask(taskId, userId);

        if (task == null) {
            return false;
        }


        taskRepository.deleteById(taskId);
        return true;
    }

    public Task editTask(Long taskId, Long userId, TaskEditRequest request){
        Task task = validateUserTask(taskId, userId);

        if (task == null) {
            return null;
        }

        task.setDescription(request.getDescription());
        taskRepository.save(task);

        return task;
    }

}
